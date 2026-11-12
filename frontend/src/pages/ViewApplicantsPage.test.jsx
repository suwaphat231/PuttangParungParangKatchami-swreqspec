import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import ViewApplicantsPage from './ViewApplicantsPage.jsx';

describe('ViewApplicantsPage', () => {
  test('test_AC_APP_01 แสดงเฉพาะรายชื่อผู้สมัครในรอบที่อาจารย์รับผิดชอบ', () => {
    render(<ViewApplicantsPage />);

    expect(screen.getByRole('heading', { name: 'รายชื่อผู้สมัคร' })).toBeTruthy();
    expect(screen.getByText('รอบรับสมัครปีการศึกษา 2569')).toBeTruthy();

    const table = screen.getByRole('table');
    expect(within(table).getByText('กมลชนก ใจดี')).toBeTruthy();
    expect(within(table).getByText('ธนกฤต มีสุข')).toBeTruthy();
    expect(within(table).queryByText('ผู้สมัครรอบอื่น')).toBeNull();
  });
});
