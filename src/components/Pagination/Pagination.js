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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Icon, Menu } from 'semantic-ui-react';
import classNames from 'classnames';

import { DEFAULT_LANGUAGE, RTL_LANGUAGES } from '../../helpers/consts';

class Pagination extends PureComponent {
  static TITLES = {
    first: <Icon name="angle double left" />,
    prev: <Icon name="angle left" />,
    next: <Icon name="angle right" />,
    last: <Icon name="angle double right" />,
  };

  static propTypes = {
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

  static defaultProps = {
    pageNo: 1,
    total: 0,
    language: DEFAULT_LANGUAGE,
    onChange: noop,
    windowSize: 6,
    titles: Pagination.TITLES,
  };

  /** Calculates "blocks" of buttons with page numbers. */
  static calcBlocks = ({ total, pageSize, pageNo }) => {
    const current     = pageNo === 0 ? 1 : pageNo;
    const totalBlocks = Math.ceil(total / pageSize);
    return { current, totalBlocks };
  };

  static visibleRange = (current, total, windowSize) => {
    const start = Math.max(1, current - windowSize);
    const end   = Math.min(current + windowSize, total);

    if (end <= start) {
      return [];
    }

    return Array.from(new Array((end - start) + 1), (val, index) => start + index);
  };

  getTitle = key => this.props.titles[key] || Pagination.TITLES[key];

  renderPage = (content, value, key, disabled, active = false, exClass = []) => {
    if (disabled) {
      return <Menu.Item disabled className={classNames(exClass)}>{content}</Menu.Item>;
    }

    return (
      <Menu.Item
        key={key}
        active={active}
        content={content}
        className={classNames(exClass)}
        onClick={() => this.props.onChange(value)}
      />
    );
  };

  render() {
    const { total, pageSize, pageNo, windowSize, language } = this.props;

    const { current, totalBlocks } = Pagination.calcBlocks({ total, pageSize, pageNo });
    const visibleRange             = Pagination.visibleRange(current, totalBlocks, windowSize);
    if (visibleRange.length === 0) {
      return null;
    }

    const isRTL = RTL_LANGUAGES.includes(language);

    const titles       = this.getTitle;
    const prevDisabled = current === 1;
    const nextDisabled = current === totalBlocks;

    return (
      <Menu icon compact className="pagination-menu" color="blue" size="tiny">
        {this.renderPage(titles(isRTL ? 'last' : 'first'), 1, 'first', prevDisabled)}
        {this.renderPage(titles(isRTL ? 'next' : 'prev'), current - 1, 'prev', prevDisabled, false, ['prev-page'])}

        {
          visibleRange.map(x =>
            this.renderPage(x, x, x, false, x === current,
              x === current ? [] : [`distance-${Math.abs(x - current)}`]))
        }

        {this.renderPage(titles(isRTL ? 'prev' : 'next'), current + 1, 'next', nextDisabled, false, ['next-page'])}
        {this.renderPage(titles(isRTL ? 'first' : 'last'), totalBlocks, 'last', nextDisabled)}
      </Menu>
    );
  }
}

export default Pagination;
