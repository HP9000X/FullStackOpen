import PropTypes from 'prop-types'

const ErrorNotification = ({ message }) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return null
  }

  return <div style={errorStyle}>{message}</div>
}

ErrorNotification.propTypes = {
  message: PropTypes.string,
}

export default ErrorNotification
