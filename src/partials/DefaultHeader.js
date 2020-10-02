import React, { Component } from 'react';
import { UncontrolledDropdown, DropdownToggle, Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import Logo from '../assets/img/logo.svg';
import { Modal } from 'antd';
// import sygnet from '../../assets/img/brand/sygnet.svg';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const { _auth: { logg } } = this.props;

    const logout = () => {
      Modal.confirm({
        title: 'Logout',
        content: 'Confirm logout',
        onOk: () => {
          this.props.signOutSuccess();
        }
      });
    }

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: Logo, width: 'auto', height: 65, alt: 'AutoUniverse Logo' }}
        // minimized={{ src: sygnet, width: 30, height: 30, alt: 'AutoUniverse Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav style={{ marginRight: 20 }} onClick={() => logout()}>
              <img src={logg.avatar_link} className="img-avatar" alt={logg.name} />
              {logg.name}
            </DropdownToggle>
          </UncontrolledDropdown>
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" /> */}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
