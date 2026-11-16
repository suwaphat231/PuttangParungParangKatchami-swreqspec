import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import ViewApplicantsPage from '../pages/ViewApplicantsPage.jsx';

describe('TC-APP-01-2: แสดงผู้สมัครหนึ่งรายในรอบที่อาจารย์รับผิดชอบ', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/list-applicants');
  });

  test('test_TC_APP_01_2_shows_single_managed_applicant', () => {
    // Given มีผู้สมัคร 1 รายในรอบรับสมัครที่อาจารย์รับผิดชอบ
    window.history.pushState({}, '', '/list-applicants?round=round-3');

    // When เปิดรอบรับสมัคร
    render(<ViewApplicantsPage />);

    // Then ระบบแสดงรายชื่อผู้สมัครที่เกี่ยวข้องเท่านั้น
    const table = screen.getByRole('table');
    expect(within(table).getByText('วีรภัทร ดวงดี')).toBeTruthy();
    expect(within(table).queryByText('กมลชนก ใจดี')).toBeNull();
    expect(within(table).queryByText('ผู้สมัครรอบอื่น')).toBeNull();
  });
});
