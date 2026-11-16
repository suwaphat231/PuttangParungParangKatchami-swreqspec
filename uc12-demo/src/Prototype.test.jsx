// @vitest-environment jsdom
// Runtime validation coverage for the UC-12 prototype UI and localStorage behavior.
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Prototype from "./Prototype.jsx";

const storageKey = "uc12-performance-result-prototype";

function openResult() {
  fireEvent.click(screen.getByRole("button", { name: "เปิดรายการผลการปฏิบัติงาน" }));
}

function chooseScenario(value) {
  fireEvent.change(screen.getByRole("combobox", { name: "เลือกสถานการณ์ข้อมูลตัวอย่าง" }), {
    target: { value }
  });
}

function beginConfirmation() {
  openResult();
  fireEvent.click(screen.getByRole("button", { name: /ยืนยันส่งผล/ }));
}

function confirmSubmission() {
  const dialog = screen.getByRole("dialog", { name: "ยืนยันส่งผลการปฏิบัติงาน" });
  fireEvent.click(within(dialog).getByRole("button", { name: "ยืนยันส่งผล" }));
}

function getSubmissionButton() {
  return within(document.querySelector(".panel-footer")).getByRole("button", {
    name: /ยืนยันส่งผล/
  });
}

describe("UC-12 submit performance result prototype", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value() {
        this.open = true;
      }
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      value() {
        this.open = false;
      }
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("TC-AC-RES-01-01 allows submission when all evaluations are complete", () => {
    render(<Prototype />);

    beginConfirmation();

    expect(getSubmissionButton().disabled).toBe(false);
    expect(screen.getByRole("dialog").open).toBe(true);
    confirmSubmission();
    expect(screen.getAllByText("ส่งผลแล้ว").length).toBe(4);
    expect(JSON.parse(window.localStorage.getItem(storageKey)).status).toBe("submitted");
  });

  it("TC-AC-RES-01-02 rejects submission while an evaluation is incomplete", () => {
    render(<Prototype />);
    chooseScenario("incomplete");
    openResult();

    expect(getSubmissionButton().disabled).toBe(true);
    expect(screen.getByText(/ยังไม่สามารถยืนยันส่งผลได้/)).toBeTruthy();
    fireEvent.click(getSubmissionButton());
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(window.localStorage.getItem(storageKey)).toBeNull();
    expect(screen.queryByText("ส่งแล้ว")).toBeNull();
  });

  it("TC-AC-RES-01-03 allows submission after the last mock evaluation becomes complete", () => {
    render(<Prototype />);
    chooseScenario("incomplete");
    openResult();

    expect(getSubmissionButton().disabled).toBe(true);
    expect(screen.getAllByText("รอประเมิน")).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: /กลับไปรายการผลประเมิน/ }));
    chooseScenario("complete");
    openResult();

    expect(getSubmissionButton().disabled).toBe(false);
    expect(screen.queryByText("รอประเมิน")).toBeNull();
    fireEvent.click(getSubmissionButton());
    expect(screen.getByRole("dialog").open).toBe(true);
    confirmSubmission();
    expect(screen.getAllByText("ส่งผลแล้ว")).toHaveLength(4);
  });

  it("TC-AC-RES-02-01 restores the submitted status after revisiting and remounting", () => {
    const firstRender = render(<Prototype />);
    beginConfirmation();
    confirmSubmission();
    fireEvent.click(screen.getByRole("button", { name: /กลับไปรายการผลประเมิน/ }));
    expect(screen.getAllByText("ส่งแล้ว").length).toBeGreaterThan(0);

    firstRender.unmount();
    render(<Prototype />);

    expect(screen.getAllByText("ส่งแล้ว").length).toBeGreaterThan(0);
    expect(JSON.parse(window.localStorage.getItem(storageKey)).status).toBe("submitted");
  });

  it("TC-NFR-AUD-01-01 records and displays the prototype submitter and submission time", () => {
    render(<Prototype />);
    beginConfirmation();
    const beforeSubmit = Date.now();
    confirmSubmission();
    const afterSubmit = Date.now();

    const submission = JSON.parse(window.localStorage.getItem(storageKey));
    expect(submission.submitter).toBe("อาจารย์ผู้ส่งผล");
    expect(Date.parse(submission.submittedAt)).toBeGreaterThanOrEqual(beforeSubmit);
    expect(Date.parse(submission.submittedAt)).toBeLessThanOrEqual(afterSubmit);
    expect(screen.getAllByText(new RegExp(submission.submitter)).length).toBeGreaterThan(0);
    expect(screen.getByText(new RegExp(`เวลาส่ง: ${new Intl.DateTimeFormat("th-TH", {
      dateStyle: "long",
      timeStyle: "short"
    }).format(new Date(submission.submittedAt))}`))).toBeTruthy();
    expect(screen.getByText(/ไม่ใช่ Backend.*Audit Log จริง/)).toBeTruthy();
  });

  it("TC-AC-RES-03-01 leaves the result unsubmitted when saving fails", () => {
    render(<Prototype />);
    beginConfirmation();
    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "ทดลองกรณีบันทึกล้มเหลว" }));

    expect(screen.queryByText("ส่งแล้ว")).toBeNull();
    expect(window.localStorage.getItem(storageKey)).toBeNull();
    expect(screen.getByText(/ผลประเมินครบทุกคน สามารถยืนยันส่งผลได้/)).toBeTruthy();

    fireEvent.click(getSubmissionButton());
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage unavailable", "QuotaExceededError");
    });
    confirmSubmission();

    expect(screen.queryByText("ส่งแล้ว")).toBeNull();
    expect(window.localStorage.getItem(storageKey)).toBeNull();
    expect(screen.getByText("บันทึกผลไม่สำเร็จ สถานะยังคงเป็นรอส่งผล")).toBeTruthy();
  });

  it("TC-NFR-REL-01-01 verifies prototype-only save/status behavior, not atomic transactionality", () => {
    render(<Prototype />);
    beginConfirmation();
    const originalSetItem = Storage.prototype.setItem;
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (key, value) {
      originalSetItem.call(this, key, value);
    });
    confirmSubmission();

    expect(setItem).toHaveBeenCalledTimes(1);
    expect(JSON.parse(window.localStorage.getItem(storageKey)).status).toBe("submitted");
    expect(screen.getAllByText("ส่งแล้ว").length).toBeGreaterThan(0);

    // localStorage is not a backend transaction and cannot prove atomicity.
    expect(screen.getByText(/ไม่ใช่ Backend.*ธุรกรรม/)).toBeTruthy();
  });

  it("TC-CONSTRAINT-RES-01-01 keeps the submitted prototype view locked without defining an unlock role", () => {
    render(<Prototype />);
    beginConfirmation();
    confirmSubmission();
    const savedSubmission = window.localStorage.getItem(storageKey);

    fireEvent.click(screen.getByRole("button", { name: /กลับไปรายการผลประเมิน/ }));
    chooseScenario("incomplete");
    expect(screen.getByRole("combobox", { name: "เลือกสถานการณ์ข้อมูลตัวอย่าง" }).value).toBe("complete");
    expect(window.localStorage.getItem(storageKey)).toBe(savedSubmission);

    openResult();
    expect(screen.getAllByText("ส่งแล้ว").length).toBeGreaterThan(0);
    expect(getSubmissionButton().disabled).toBe(true);
    expect(screen.queryByRole("button", { name: /ปลดล็อก|แก้ไขผล|ยกเลิกการส่ง/ })).toBeNull();
  });
});
