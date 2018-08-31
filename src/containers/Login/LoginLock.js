import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { UnlockWallet, AddressMismatch, ErrorModal } from './components';
import { actions as authActions } from 'public-modules/Authentication';
import {
  getCurrentUserSelector,
  logoutStateSelector
} from 'public-modules/Authentication/selectors';
import {
  addressSelector,
  walletLockedSelector,
  hasWalletSelector
} from 'public-modules/Client/selectors';

const LoginLockComponent = props => {
  const {
    walletLocked,
    walletAddress,
    userAddress,
    img,
    logout,
    loggingOut,
    resetLogoutState,
    error
  } = props;

  const config = {
    showUnlockWallet: false,
    showError: false,
    showMismatch: false
  };

  if (walletLocked || !walletAddress) {
    config.showUnlockWallet = true;
  } else if (error) {
    config.showError = true;
  } else if (
    userAddress &&
    userAddress.toLowerCase() !== walletAddress.toLowerCase()
  ) {
    config.showMismatch = true;
  }

  return (
    <React.Fragment>
      <UnlockWallet
        visible={config.showUnlockWallet}
        pageLevel
        closable={false}
      />
      <ErrorModal visible={config.showError} onClose={resetLogoutState} />
      <AddressMismatch
        closable={false}
        visible={config.showMismatch}
        currentAddress={walletAddress}
        previousAddress={userAddress}
        img={img}
        logout={logout}
        loggingOut={loggingOut}
      />
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  const user = getCurrentUserSelector(state);
  const logoutState = logoutStateSelector(state);

  return {
    hasWallet: hasWalletSelector(state),
    walletLocked: walletLockedSelector(state),
    walletAddress: addressSelector(state),
    userAddress: user && user.public_address,
    img: user && user.img,
    error: logoutState.error,
    loggingOut: logoutState.loading
  };
};

const LoginLock = compose(
  connect(
    mapStateToProps,
    {
      logout: authActions.logout,
      resetLogoutState: authActions.resetLogoutState
    }
  )
)(LoginLockComponent);

LoginLock.propTypes = {
  hasWallet: PropTypes.bool,
  walletLocked: PropTypes.bool,
  walletAddress: PropTypes.string,
  userAddress: PropTypes.string,
  img: PropTypes.string,
  logout: PropTypes.func,
  loggingOut: PropTypes.bool,
  resetLogoutState: PropTypes.func,
  error: PropTypes.string
};

export default LoginLock;
