import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FieldPosition.css';

const FieldPosition = ({miss, hit, sank, handleClick}) => (
  <div
    className={classNames(
      'field-position',
      {
        miss,
        hit,
        sank
      }
    )}
    onClick={handleClick}
  >
  </div>
);

FieldPosition.propTypes = {
  miss: PropTypes.bool.isRequired,
  hit: PropTypes.bool.isRequired,
  sank: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default FieldPosition;
