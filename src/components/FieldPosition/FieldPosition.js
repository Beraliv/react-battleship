import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FieldPosition.css';

const FieldPosition = ({missed, injured, killed, handleClick}) => (
  <div
    className={classNames(
      'field-position',
      {
        missed,
        injured,
        killed
      }
    )}
    onClick={handleClick}
  >
  </div>
);

FieldPosition.propTypes = {
  missed: PropTypes.bool.isRequired,
  injured: PropTypes.bool.isRequired,
  killed: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default FieldPosition;
