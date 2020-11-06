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
import { noop } from '../../helpers/utils';
import { Icon, Menu } from 'semantic-ui-react';
import classNames from 'classnames';

import { DEFAULT_LANGUAGE } from '../../helpers/consts';
import { isLanguageRtl } from '../../helpers/i18n-utils';

const TITLES = {
  first: <Icon name="angle double left" />,
  prev: <Icon name="angle left" />,
  next: <Icon name="angle right" />,
  last: <Icon name="angle double right" />,
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
  const classes = classNames(exClass);

  if (disabled) {
    return <Menu.Item disabled className={classes}>{content}</Menu.Item>;
  }

  return (
    <Menu.Item
      key={key}
      active={active}
      content={content}
      className={classes}
      onClick={() => onChange(value)}
    />
  );
};

const Pagination = ({ pageSize, total = 0, pageNo = 1, windowSize = 6, language = DEFAULT_LANGUAGE, titles = TITLES, onChange = noop }) => {
  const { current, totalBlocks } = calcBlocks({ total, pageSize, pageNo });
  const vr                       = visibleRange(current, totalBlocks, windowSize);
  if (vr.length === 0) {
    return null;
  }

  const isRTL = isLanguageRtl(language);

  const title        = getTitle(titles);
  const prevDisabled = current === 1;
  const nextDisabled = current === totalBlocks;

  return (
    <Menu icon compact className="pagination-menu" color="blue" size="tiny">
      {renderPage(title(isRTL ? 'last' : 'first'), 1, 'first', prevDisabled, onChange)}
      {renderPage(title(isRTL ? 'next' : 'prev'), current - 1, 'prev', prevDisabled, onChange, false, ['prev-page'])}

      {
        vr.map(x => (
          renderPage(x, x, x, false, onChange, x === current,
            x === current ? [] : [`distance-${Math.abs(x - current)}`])))
      }

      {renderPage(title(isRTL ? 'prev' : 'next'), current + 1, 'next', nextDisabled, onChange, false, ['next-page'])}
      {renderPage(title(isRTL ? 'first' : 'last'), totalBlocks, 'last', nextDisabled, onChange)}
    </Menu>
  );
};

Pagination.propTypes = {
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number,
  pageNo: PropTypes.number,
  language: PropTypes.string,
  onChange: PropTypes.func,
  windowSize: PropTypes.number,
  titles: PropTypes.shape({
    first: PropTypes.node,
    prev: PropTypes.node,
    next: PropTypes.node,
    last: PropTypes.node,
  }),
};

export default Pagination;
