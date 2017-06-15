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
 *            prevSet: "<<<",
 *            nextSet: ">>>",
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
import { Icon, Menu } from 'semantic-ui-react';
import noop from 'lodash/noop';

class Pagination extends PureComponent {

  static TITLES = {
    first: <Icon name="angle double left" />,
    prev: <Icon name="angle left" />,
    prevSet: <Icon name="ellipsis horizontal" />,
    nextSet: <Icon name="ellipsis horizontal" />,
    next: <Icon name="angle right" />,
    last: <Icon name="angle double right" />,
  };

  static WINDOW_SIZE = 12;

  static propTypes = {
    pageSize: PropTypes.number.isRequired,
    total: PropTypes.number,
    pageNo: PropTypes.number,
    onChange: PropTypes.func,
    titles: PropTypes.shape({
      first: PropTypes.node,
      prev: PropTypes.node,
      prevSet: PropTypes.node,
      nextSet: PropTypes.node,
      next: PropTypes.node,
      last: PropTypes.node,
    }),
  };

  static defaultProps = {
    pageNo: 1,
    total: 0,
    onChange: noop,
    titles: Pagination.TITLES,
  };

  /** Calculates "blocks" of buttons with page numbers. */
  static calcBlocks = ({ total, pageSize, pageNo }) => {
    const current = pageNo === 0 ? 1 : pageNo;
    const blocks  = Math.ceil(total / pageSize);

    return {
      total: blocks,
      current,
      size: pageSize,
    };
  };

  static isPrevDisabled   = ({ current }) => current === 1;
  static isPrevMoreHidden = ({ current, total }) => total === 1 || current === 1;
  static isNextMoreHidden = ({ total, current }) => (current + Pagination.WINDOW_SIZE >= total);
  static isNextDisabled   = ({ total, current }) => (current === total);

  static visibleRange = ({ current: currentBlock, total }) => {
    let start;
    let last;
    if (currentBlock === 1) {
      start = currentBlock;
      last  = start + Pagination.WINDOW_SIZE;
    } else if ((total - currentBlock) < Pagination.WINDOW_SIZE) {
      start = currentBlock - (Pagination.WINDOW_SIZE / 2);
      last  = start + Pagination.WINDOW_SIZE;
    } else {
      start = currentBlock - 1;
      last  = start + Pagination.WINDOW_SIZE;
    }
    const end = (last > total) ? total : last;

    if (end <= start) {
      return [];
    }

    return Array.from(new Array((end - start) + 1), (val, index) => start + index);
  };

  getTitles = key => this.props.titles[key] || Pagination.TITLES[key];

  /** Renders block of pages' buttons with numbers. */
  renderPages = (blocks) => {
    const range      = Pagination.visibleRange(blocks);
    const { pageNo } = this.props;
    return range.map(x => (this.renderPage(x, x, false, x === pageNo)));
  };

  renderPage = (content, value, disabled, active = false) => {
    if (disabled) {
      return <Menu.Item disabled>{content}</Menu.Item>;
    }

    return (
      <Menu.Item
        key={value}
        active={active}
        content={content}
        onClick={() => this.props.onChange(value)}
      />
    );
  };

  render() {
    const titles                      = this.getTitles;
    const { total, pageSize, pageNo } = this.props;
    const blocks                      = Pagination.calcBlocks({ total, pageSize, pageNo });

    return (
      <Menu compact color="blue">
        {this.renderPage(titles('first'), 1, Pagination.isPrevDisabled(blocks))}
        {
          Pagination.isPrevMoreHidden(blocks) ?
            null :
            this.renderPage(titles('prev'), blocks.current - 1, Pagination.isPrevDisabled(blocks))
        }
        {this.renderPage(titles('prevSet'), -100, true)}

        {this.renderPages(blocks)}

        {this.renderPage(titles('nextSet'), -101, true)}
        {
          Pagination.isNextMoreHidden(blocks) ?
            null :
            this.renderPage(titles('next'), blocks.current + 1, Pagination.isNextDisabled(blocks))
        }
        {this.renderPage(titles('last'), blocks.total, Pagination.isNextDisabled(blocks))}
      </Menu>
    );
  }
}

export default Pagination;
