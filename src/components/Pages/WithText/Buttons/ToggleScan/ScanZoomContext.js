import { createContext } from 'react';
import { noop } from '../../../../../helpers/utils';

export const ScanZoomContext = createContext({ zoom: 100, setZoom: noop });
