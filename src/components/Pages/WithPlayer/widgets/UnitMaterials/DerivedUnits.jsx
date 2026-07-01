import ContentItem from '../../../../shared/ContentItem/ContentItemContainer';

const DerivedUnits = ({ selectedUnits }) => (
  <div className="m-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 cu_items">
    {
      selectedUnits
        .filter(x => !!x)
        .map((unit, i) => <ContentItem id={unit.id} key={unit.id} asList={true} />)
    }
  </div>
);


export default DerivedUnits;
