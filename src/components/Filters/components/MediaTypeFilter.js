import React from 'react';

import { MT_VIDEO, MT_AUDIO, MT_IMAGE, MT_TEXT } from '../../../helpers/consts';
import FlatListFilter from './FlatListFilter';

const options = [MT_TEXT, MT_AUDIO, MT_VIDEO, MT_IMAGE].map(x => ({ text: x, value: x, }));

const MediaTypeFilter = (props) => <FlatListFilter name="publishers-filter" options={options} {...props} />

export default MediaTypeFilter;
