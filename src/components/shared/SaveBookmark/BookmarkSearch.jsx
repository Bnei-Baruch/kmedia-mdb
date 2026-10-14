const BookmarkSearch = ({ className = '', ...props }) => (
  <div className={`bookmark_search relative inline-flex items-center ${className}`}>
    <input
      className="w-full border-0 border-b border-[#767676] bg-white py-[4px] ps-[42.74px] pe-[16px] text-[16px] leading-[1.21428571em] focus:outline-none"
      {...props}
    />
    <span className="material-symbols-outlined pointer-events-none absolute ltr:left-0 rtl:right-0 w-[37px] text-center text-[16px]! opacity-50">search</span>
  </div>
);

export default BookmarkSearch;
