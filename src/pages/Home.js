import React, { useContext } from 'react'

import { useQuery } from '@apollo/react-hooks';

import { Transition, Grid } from 'semantic-ui-react'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'
import PostForm from '../components/PostForm'
import { FETCH_POSTS_QUERY } from '../util/graphql'

function Home() {
    const { user } = useContext(AuthContext)
    let posts = ''
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);

    if (data) {
        posts = { data: data.getPosts }
      }
    

    return (
        <Grid columns={3} divided>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
        <Grid.Row>
            {user && (
                <Grid.Column>
                    <PostForm />
                </Grid.Column>
            )}
            {loading ? (
                <h1>Loading posts..</h1>
            ) : (
                <Transition.Group>
                    {
                    posts.data && posts.data.map(post =>(//mapはいっぱいfetchする時
                        <Grid.Column key={post.id} style={{ merginBottom: 30 }}>
                            <PostCard post={post} />
                        </Grid.Column>
                    ))
                    }
                </Transition.Group>
            )}
      </Grid.Row>
      </Grid>

    )
}



export default Home
