import { cleanup, render, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { DeviceInfoContext, ClientChroniclesContext } from '../../../helpers/app-contexts';
import { initialState as settingsInitialState } from '../../../redux/modules/settings';
import SimpleModeContainer from './Container';

vi.mock('./Page', () => ({ selectedDate, filesLanguages, onDayClick, onLanguageChange }) => (
  <div data-testid="simple-mode-page">
    <span data-testid="selected-date">{selectedDate?.toISOString?.()}</span>
    <span data-testid="files-languages">{filesLanguages?.join(',')}</span>
    <button data-testid="day-click" onClick={() => onDayClick(new Date('2024-03-10'))} />
    <button data-testid="disabled-click" onClick={() => onDayClick(new Date('2024-03-10'), { disabled: true })} />
    <button data-testid="language-change" onClick={() => onLanguageChange(['ru', 'he'])} />
  </div>
));

const makeStore = (contentLanguages = ['en']) =>
  configureStore({
    reducer: { settings: (state = { ...settingsInitialState, contentLanguages }, action) => state },
  });

const deviceInfo = { browserName: 'Chrome', isMobile: false };

const renderContainer = (initialEntry = '/', storeOverride = null) => {
  const store = storeOverride ?? makeStore();
  const utils = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <DeviceInfoContext.Provider value={deviceInfo}>
          <ClientChroniclesContext.Provider value={null}>
            <SimpleModeContainer />
          </ClientChroniclesContext.Provider>
        </DeviceInfoContext.Provider>
      </MemoryRouter>
    </Provider>
  );
  return { ...utils, store };
};

afterEach(cleanup);

describe('SimpleModeContainer', () => {
  it('renders Page component', () => {
    const { getByTestId } = renderContainer();
    expect(getByTestId('simple-mode-page')).toBeTruthy();
  });

  it('initializes selectedDate from valid URL date query param', () => {
    const { getByTestId } = renderContainer('/?date=2024-03-10');
    const dateText = getByTestId('selected-date').textContent;
    expect(dateText).toContain('2024-03-10');
  });

  it('defaults selectedDate to today when no date in URL', () => {
    const today = new Date();
    const { getByTestId } = renderContainer('/');
    const dateText = getByTestId('selected-date').textContent;
    const year = today.getFullYear().toString();
    expect(dateText).toContain(year);
  });

  it('defaults selectedDate to today when URL date is invalid', () => {
    const today = new Date();
    const { getByTestId } = renderContainer('/?date=not-a-date');
    const dateText = getByTestId('selected-date').textContent;
    expect(dateText).toContain(today.getFullYear().toString());
  });

  it('passes contentLanguages from Redux store as filesLanguages', () => {
    const store = makeStore(['en', 'ru']);
    const { getByTestId } = renderContainer('/', store);
    expect(getByTestId('files-languages').textContent).toBe('en,ru');
  });

  it('does not update selectedDate when onDayClick called with disabled flag', () => {
    const { getByTestId } = renderContainer('/?date=2024-03-10');
    const before = getByTestId('selected-date').textContent;
    act(() => {
      getByTestId('disabled-click').click();
    });
    expect(getByTestId('selected-date').textContent).toBe(before);
  });

  it('updates filesLanguages when onLanguageChange is called', () => {
    const { getByTestId } = renderContainer();
    expect(getByTestId('files-languages').textContent).toBe('en');
    act(() => {
      getByTestId('language-change').click();
    });
    expect(getByTestId('files-languages').textContent).toBe('ru,he');
  });
});
