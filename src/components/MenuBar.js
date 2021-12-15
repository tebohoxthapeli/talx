import { Button, Header, Image } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import React from "react";


import { useContextMethods } from "../context/methods";
import MyPopup from "../util/MyPopup";

function MenuBar() {
  const { pathname } = useLocation();
  const { user, logout } = useContextMethods();

  return (
    user && (
      <div className="MenuBar">
        <MyPopup content="View your profile" position="right center">
          <div>
            <Link to={`/profile/${user._id}`}>
              <Header
                as="h3"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  circular
                  src={`https://avatars.dicebear.com/api/identicon/${user.username}.svg`}
                />
                {user.username}
              </Header>
            </Link>
          </div>
        </MyPopup>

        {pathname === "/" ? (
          <div>
            <Header as={Link} to="/" size="huge">
              TalkX
            </Header>
          </div>
        ) : (
          <MyPopup content="Go back home" position="right center">
            <div>
              <Header as={Link} to="/" size="huge">
                TalkX
              </Header>
            </div>
          </MyPopup>
        )}

        <div>
          <Button
            name="logout"
            onClick={logout}
            as={Link}
            to="/login"
            inverted
            color="orange"
            style={{ margin: 0 }}
          >
            Log out
          </Button>
        </div>
      </div>
    )
  );
}

export default MenuBar;
