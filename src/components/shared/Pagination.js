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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

class Pagination extends Component {

  static TITLES = {
    first:  <Icon name="angle double left" />,
    prev: <Icon name="angle left" />,
    prevSet: <Icon name="ellipsis horizontal" />,
    nextSet: <Icon name="ellipsis horizontal" />,
    next: <Icon name="angle right" />,
    last: <Icon name="angle double right" />,
  };

  static WINDOW_SIZE = 12;

  static propTypes = {
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
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
    titles: Pagination.TITLES
  };

  static range = ({ start, end }) => {
    if (end <= start) {
      return [];
    }
    return Array.from(new Array((end - start) + 1), (val, index) => start + index);
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
  static visibleRange     = ({ current: currentBlock, total }) => {
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

    return { start, end };
  };

  /** Renders block of pages' buttons with numbers. */
  static renderPages = (pair, pageNo) => {
    const page = pageNo === 0 ? 1 : pageNo;
    return Pagination.range(pair).map((num) => {
      const isActive = page === num;

      return (
        <Page
          key={num.toString()}
          index={num}
          isActive={isActive}
        >{num}</Page>
      );
    });
  };

  getTitles = key => this.props.titles[key] || Pagination.TITLES[key];

  render() {
    const titles                      = this.getTitles;
    const { total, pageSize, pageNo } = this.props;
    const blocks                      = Pagination.calcBlocks({ total, pageSize, pageNo });

    return (
      <Menu compact color='blue'>
        <Page
          index={1}
          isDisabled={Pagination.isPrevDisabled(blocks)}
        >{titles('first')}</Page>
        <Page
          index={blocks.current - 1}
          isDisabled={Pagination.isPrevDisabled(blocks)}
        >{titles('prev')}</Page>
        <Page
          isHidden={Pagination.isPrevMoreHidden(blocks)}
          isDisabled
        >{titles('prevSet')}</Page>

        {Pagination.renderPages(Pagination.visibleRange(blocks), this.props.pageNo)}

        <Page
          isHidden={Pagination.isNextMoreHidden(blocks)}
          isDisabled
        >{titles('nextSet')}</Page>
        <Page
          index={blocks.current + 1}
          isDisabled={Pagination.isNextDisabled(blocks)}
        >{titles('next')}</Page>
        <Page
          index={blocks.total}
          isDisabled={Pagination.isNextDisabled(blocks)}
        >{titles('last')}</Page>

      </Menu>
    );
  }
}

const Page = (props) => {
  const { isHidden, isActive, isDisabled, index, children } = props;

  if (isHidden) {
    return null;
  }

  if (isDisabled) {
    return (
      <Menu.Item
        disabled={isDisabled}
      >{children}</Menu.Item>
    );
  }

  return (
    <Menu.Item
      as={NavLink}
      activeClassName=""
      key={index}
      disabled={isDisabled}
      active={isActive}
      to={isDisabled ? '' : {
        pathname: '/lessons',
        search: `?page=${index}`
      }}
    >{children}</Menu.Item>
  );
};

Page.propTypes = {
  isHidden: PropTypes.bool,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  index: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.number]),
};

Page.defaultProps = {
  isHidden: false,
  isActive: false,
  isDisabled: false,
  index: 0,
  children: ''
};

export default Pagination;
