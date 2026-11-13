import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import ViewApplicantsPage from '../pages/ViewApplicantsPage.jsx';

describe('TC-APP-01-1: แสดงผู้สมัครในรอบที่อาจารย์รับผิดชอบ', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/list-applicants');
  });

  test('test_TC_APP_01_1_shows_managed_round_applicants', () => {
    // Given มีผู้สมัครในรอบรับสมัครที่อาจารย์รับผิดชอบ
    // When เปิดรอบรับสมัคร
    render(<ViewApplicantsPage />);

    // Then ระบบแสดงรายชื่อผู้สมัครที่เกี่ยวข้องเท่านั้น
    const table = screen.getByRole('table');
    expect(within(table).getByText('กมลชนก ใจดี')).toBeTruthy();
    expect(within(table).getByText('ธนกฤต มีสุข')).toBeTruthy();
    expect(within(table).queryByText('ผู้สมัครรอบอื่น')).toBeNull();
  });
});
