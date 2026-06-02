/**
 * # Stateless Pager component
 *
 * ## Usage
 * ```
 * <Pager pageNo={3}
 *        total={20}
 *        pageSize={5}
 *        titles={{
 *            first:   "First",
 *            prev:    "Prev",
 *            next:    "Next",
 *            last:    "Last"
 *        }} />
 * ```
 *
 * ## How it looks like
 * ```
 * First | Prev | ... | 6 | 7 | 8 | 9 | ... | Next | Last
 * ```
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import { useSelector } from 'react-redux';

import { noop } from '../../helpers/utils';
import { isLanguageRtl } from '../../helpers/i18n-utils';
import { settingsGetUILangSelector } from '../../redux/selectors';

const TITLES = {
  first: <span className="material-symbols-outlined">keyboard_double_arrow_left</span>,
  prev : <span className="material-symbols-outlined">chevron_left</span>,
  next : <span className="material-symbols-outlined">chevron_right</span>,
  last : <span className="material-symbols-outlined">keyboard_double_arrow_right</span>
};

const getTitle = titles => key => titles[key] || TITLES[key];

/** Calculates "blocks" of buttons with page numbers. */
const calcBlocks = ({ total, pageSize, pageNo }) => {
  const current     = pageNo === 0 ? 1 : pageNo;
  const totalBlocks = Math.ceil(total / pageSize);
  return { current, totalBlocks };
};

const visibleRange = (current, total, windowSize) => {
  const start = Math.max(1, current - windowSize);
  const end   = Math.min(current + windowSize, total);

  if (end <= start) {
    return [];
  }

  return Array.from(new Array((end - start) + 1), (val, index) => start + index);
};

const renderPage = (content, value, key, disabled, onChange, active = false, exClass = []) => {
  const classes = clsx(exClass, {
    'opacity-50 pointer-events-none': disabled,
    'font-bold bg-blue-100': active
  });

  if (disabled) {
    return (
      <div key={key} className={clsx('pagination-menu-item disabled', classes)}>
        {content}
      </div>
    );
  }

  return (
    <div
      key={key}
      className={clsx('pagination-menu-item', classes, { active })}
      onClick={() => onChange(value)}
    >
      {content}
    </div>
  );
};

const Pagination = ({ pageSize, total = 0, pageNo = 1, windowSize = 6, titles = TITLES, onChange = noop }) => {
  const uiLang = useSelector(settingsGetUILangSelector);
  const isRTL  = isLanguageRtl(uiLang);

  const { current, totalBlocks } = calcBlocks({ total, pageSize, pageNo });
  const vr                       = visibleRange(current, totalBlocks, windowSize);
  if (vr.length === 0) {
    return null;
  }

  const title        = getTitle(titles);
  const prevDisabled = current === 1;
  const nextDisabled = current === totalBlocks;

  return (
    <nav className="pagination-menu flex items-center justify-center py-4">
      {renderPage(title(isRTL ? 'last' : 'first'), 1, 'first', prevDisabled, onChange)}
      {renderPage(title(isRTL ? 'next' : 'prev'), current - 1, 'prev', prevDisabled, onChange, false, ['prev-page'])}

      {
        vr.map(x => (
          renderPage(x, x, x, false, onChange, x === current,
            x === current ? [] : [`distance-${Math.abs(x - current)}`])))
      }

      {renderPage(title(isRTL ? 'prev' : 'next'), current + 1, 'next', nextDisabled, onChange, false, ['next-page'])}
      {renderPage(title(isRTL ? 'first' : 'last'), totalBlocks, 'last', nextDisabled, onChange)}
    </nav>
  );
};

Pagination.propTypes = {
  pageSize  : PropTypes.number.isRequired,
  total     : PropTypes.number,
  pageNo    : PropTypes.number,
  onChange  : PropTypes.func,
  windowSize: PropTypes.number,
  titles    : PropTypes.shape({
    first: PropTypes.node,
    prev : PropTypes.node,
    next : PropTypes.node,
    last : PropTypes.node
  })
};

export default Pagination;
