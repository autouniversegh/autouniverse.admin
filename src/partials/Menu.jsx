import React from 'react';
import { Link } from 'react-router-dom';
import * as func from '../providers/functions';

const Menu = props => {
  const path = props.router.location.pathname;
  const root = path.split('/');

  return (
    <ul className="nav nav-aside">
      {/* <li className="nav-label">Dashboard</li> */}
      {props.utils.menus.map(menu => (
        menu.subs.length > 0 ? (
          func.hasR(menu.code) && (
            <li key={menu.icon} className={`nav-item with-sub ${root[1] === menu.link ? 'active show' : ''}`}>
              <a href={`#${menu.link}`} className="nav-link"><i data-feather={menu.icon}></i> <span>{menu.name}</span></a>
              <ul>
                {menu.subs.map(sub => (
                  func.hasR(sub.code) && (
                    <li key={sub.link} className={path === '/' + sub.link ? 'active' : ''}><Link to={`/${sub.link}`}>{sub.name}</Link></li>
                  )
                ))}
              </ul>
            </li>
          )
        ) : (
            func.hasR(menu.code) && (
              <li className={`nav-item ${root[1] === menu.link ? 'active' : ''}`} key={menu.icon}>
                <Link to={`/${menu.link}`} className="nav-link"><i data-feather={menu.icon}></i> <span>{menu.name}</span></Link>
              </li>
            )
          )
      ))}
    </ul>
  );

};

export default Menu;