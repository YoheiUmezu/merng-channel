import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';

function DeleteButton({ postId, commentId, callback }) {
    const[confirmOpen, setConfirmOpen] = useState(false)

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
    //commentを消すときはDELETE_COMMENT_MUTATION

    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy){
            setConfirmOpen(false);
            if(!commentId){
                //todo remove post from cache
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                //   data.getPosts = data.getPosts.filter(p => p.id !== postId);
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                    getPosts: data.getPosts.filter(p => p.id !== postId)
                    }
                });
            }
            if(callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    });

    return (//2つの小要素（モーダルと普通の画面）があるから<>フラグメントを使う
        //２つの画面<div></div>が必要
        <>
        <Popup
        inverted
        content={commentId ? 'Delete comment' : 'Delete post'}
        trigger={
            <Button 
            as="div" 
            color="red" 
            floated="right"
            onClick={() => setConfirmOpen(true)} >
              <Icon name="trash" style={{ margin: 0 }}/>
            </Button>
        } />

          <Confirm
            open={confirmOpen}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={deletePostOrMutation} />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation delePost($postId: ID!){
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments{
                id username createdAt body
            } 
        commentCount
        }
    }
`

export default DeleteButton
