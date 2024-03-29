import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { getUser } from "utils/auth";
import { ROUTES } from "./RouteConfig";


export default function Routes() {
  const [userRole, setUserRole] = useState<string>();

  useEffect(() => {
    setUserRole(getUser("roleName"));
  }, []);

  function getDefaultRoute(){
    switch(userRole){
      case "Admin":
        return '/user'
      case "SubUser":
        return '/project'
      case "HR":
        return '/career'
    }
  }
  return (
    <div id="admin-content-wrap">
      <Switch>
        {ROUTES.map((route) => {
          console.log(userRole, route.allowed)
          if (userRole && route.allowed.includes(userRole))
            return (
              <Route
                key={route.path}
                path={"/admin" + route.path}
                component={route.component}
              />
            );
          return undefined
        })}
        <Route path={`/`} render={() => <Redirect to={`/admin${getDefaultRoute()}`}/>}  />
      </Switch>
    </div>
  );
}
