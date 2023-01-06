import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { compose } from 'redux';
import { IntlProps } from '../..';
import { showLanding, useSharedLayout } from '../../api';
import { Logo } from '../../components';
import {
    changeLanguage,
    changeUserDataFetch,
    logoutFetch,
    selectUserInfo,
    selectUserLoggedIn,
    selectAbilities,
    AbilitiesInterface,
    User,
} from '../../modules';

    import classnames from 'classnames';
    import { History } from 'history';
    import { Dropdown } from 'react-bootstrap';
    import { FormattedMessage } from 'react-intl';
    import { Link, RouteProps, withRouter } from 'react-router-dom';
    import { languages } from '../../api/config';
    import { LogoutIcon } from '../../assets/images/sidebar/LogoutIcon';
    import { ProfileIcon } from '../../assets/images/sidebar/ProfileIcon';
    import { SidebarIcons } from '../../assets/images/sidebar/SidebarIcons';
    import { pgRoutes } from '../../constants';
    import enIcon from 'src/assets/images/sidebar/en.svg';
    import ruIcon from 'src/assets/images/sidebar/ru.svg';
    
    interface State {
        isOpenLanguage: boolean;
    }
    
    interface DispatchProps {
        changeLanguage: typeof changeLanguage;
        logoutFetch: typeof logoutFetch;
    }
    
    interface ReduxProps {
        lang: string;
        colorTheme: string;
        isLoggedIn: boolean;
        isActive: boolean;
        user: User;
        abilities: AbilitiesInterface;
    }
    
    interface OwnProps {
        onLinkChange?: () => void;
        history: History;
        location: {
            pathnname: string;
        };
        changeUserDataFetch: typeof changeUserDataFetch;
    }



interface ReduxProps {
    colorTheme: string;
    mobileWallet: string;
    sidebarOpened: boolean;
    marketSelectorOpened: boolean;
}



interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}


type Props = ReduxProps & DispatchProps & IntlProps & LocationProps;

class TradingNavBar extends React.Component<Props> {
    
    
        public state = {
            isOpenLanguage: false,
        };
    
        public componentWillReceiveProps(nextProps: Props) {
            if (this.props.location.pathname !== nextProps.location.pathname && nextProps.isActive) {
            }
        }
    
       
    
        public renderNavItems = (address: string) => (values: string[], index: number) => {
            const { currentMarket } = this.props;
    
            const [name, url, img] = values;

            const path = url.includes('/trading') && currentMarket ? `/trading/${currentMarket.id}` : url;
            const isActive = (url === '/trading/' && address.includes('/trading')) || address === url;
    
            const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
                'pg-sidebar-wrapper-nav-item-img--active': isActive,
            });
    
            return (
                <Link to={path} key={index} className={`${isActive && 'route-selected'}`}>
                    <div className="pg-sidebar-wrapper-nav-item">
                        <div className="pg-sidebar-wrapper-nav-item-img-wrapper">
                            <SidebarIcons className={iconClassName} name={img} />
                        </div>
                        <p className="pg-sidebar-wrapper-nav-item-text">
                            <FormattedMessage id={name} />
                        </p>
                    </div>
                </Link>
            );
        };
    
        public renderProfileLink = () => {
            const { isLoggedIn, location } = this.props;
            const address = location ? location.pathname : '';
            const isActive = address === '/profile';
    
            const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
                'pg-sidebar-wrapper-nav-item-img--active': isActive,
            });
    
            return (
                isLoggedIn && (
                    <div className="pg-sidebar-wrapper-profile">
                        <Link to="/profile"  className={`${isActive && 'route-selected'}`}>
                            <div className="pg-sidebar-wrapper-profile-link">
                                <ProfileIcon className={iconClassName} />
                                <p className="pg-sidebar-wrapper-profile-link-text">
                                    <FormattedMessage id={'page.header.navbar.profile'} />
                                </p>
                            </div>
                        </Link>
                    </div>
                )
            );
        };
    
        public renderLogout = () => {
            const { isLoggedIn } = this.props;
            if (!isLoggedIn) {
                return null;
            }
    
            return (
                <div className="pg-sidebar-wrapper-logout">
                    <div className="pg-sidebar-wrapper-logout-link" onClick={this.props.logoutFetch}>
                        <LogoutIcon className="pg-sidebar-wrapper-logout-link-img" />
                        <p className="pg-sidebar-wrapper-logout-link-text">
                            <FormattedMessage id={'page.body.profile.content.action.logout'} />
                        </p>
                    </div>
                </div>
            );
        };
    
        public getLanguageDropdownItems = () => {
            return languages.map((l: string, index: number) => (
                <Dropdown.Item key={index} onClick={(e) => this.handleChangeLanguage(l)}>
                    <div className="dropdown-row">
                        <img src={this.getLanguageIcon(l)} alt={l} />
                        <span>{l.toUpperCase()}</span>
                    </div>
                </Dropdown.Item>
            ));
        };
    
        private getLanguageIcon = (name: string): string => {
            if (name === 'ru') {
                return ruIcon;
            } else {
                return enIcon;
            }
        };
    
        private handleChangeLanguage = (language: string) => {
            const { user, isLoggedIn } = this.props;
    
            if (isLoggedIn) {
                const data = user.data && JSON.parse(user.data);
    
                if (data && data.language && data.language !== language) {
                    const payload = {
                        ...user,
                        data: JSON.stringify({
                            ...data,
                            language,
                        }),
                    };
    
                    this.props.changeUserDataFetch({ user: payload });
                }
            }
    
            this.props.changeLanguage(language);
        };
    
    
    
    
    
    
    public render() {
        const { location } = this.props;
        const tradingCls = location.pathname.includes('/trading') ? 'pg-container-trading' : '';
        
        
        return (
            <header className={`pg-header`}>
                <div className={`pg-container pg-header__content ${tradingCls}`}>
                    {!useSharedLayout() &&
                        <>
                            <div onClick={(e) => this.redirectToLanding()} className="pg-header__logo">
                                <Logo />
                            </div>
                        </>
                    }
                   
                    <div className="pg-header__navbar">
                   
                        
                    </div>
                </div>
            </header>
        );
    }
    
    
    
    
    
    
    
    
    private redirectToLanding = () => {
        this.props.history.push(`${showLanding() ? '/' : '/trading'}`);
    };
    
    
    
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    isLoggedIn: selectUserLoggedIn(state),
    currentMarket: selectCurrentMarket(state),
    lang: selectCurrentLanguage(state),
    isActive: selectSidebarState(state),
    abilities: selectAbilities(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    changeLanguage: (payload) => dispatch(changeLanguage(payload)),
    toggleSidebar: (payload) => dispatch(toggleSidebar(payload)),
    logoutFetch: () => dispatch(logoutFetch()),
    changeUserDataFetch: (payload) => dispatch(changeUserDataFetch(payload)),
});

// const mapStateToProps = (state: RootState): ReduxProps => ({
//     currentMarket: selectCurrentMarket(state),
//     colorTheme: selectCurrentColorTheme(state),
//     mobileWallet: selectMobileWalletUi(state),
//     sidebarOpened: selectSidebarState(state),
//     marketSelectorOpened: selectMarketSelectorState(state),
// });

// const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
//     setMobileWalletUi: (payload) => dispatch(setMobileWalletUi(payload)),
//     toggleSidebar: (payload) => dispatch(toggleSidebar(payload)),
//     toggleMarketSelector: () => dispatch(toggleMarketSelector()),
// });

export const TradingNav = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(TradingNavBar) as React.ComponentClass;
