import ContentItem from '../../../../shared/ContentItem/ContentItemContainer';

const DerivedUnits = ({ selectedUnits }) => (
  <div className="m-4 flex flex-col gap-2">
    {
      selectedUnits
        .filter(x => !!x)
        .map((unit, i) => <ContentItem id={unit.id} key={unit.id} asList={true} withCCUInfo={true} size="sm" />)
    }
  </div>
);


export default DerivedUnits;
