import { useQuery } from "@apollo/client";
import { Grid, Transition, Header, Loader } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

import { GET_ALL_POSTS } from "../graphql/post";

function Home() {
  const { data, loading } = useQuery(GET_ALL_POSTS);

  return (
    <div className="Home">
      {loading ? (
        <Loader active />
      ) : (
        <Grid style={{ padding: "0 2rem" }} inverted>
          <Grid.Row centered>
            <PostForm />
          </Grid.Row>

          {data && data.getAllPosts.length > 0 ? (
            <Transition.Group animation="fly left">
              {data.getAllPosts.map((post) => (
                <Grid.Row key={post._id}>
                  <PostCard {...post} />
                </Grid.Row>
              ))}
            </Transition.Group>
          ) : (
            <Grid.Row centered>
              <Header size="huge">Your feed is currently empty</Header>
            </Grid.Row>
          )}
        </Grid>
      )}
    </div>
  );
}

export default Home;
