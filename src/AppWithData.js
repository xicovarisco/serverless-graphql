import React from 'react';
import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';

const AppWithData = () => {
    const FETCH_USERS = gql`
        {
            fetchUsers {
                _id
                email
            }
        }
    `;
    const { loading, error, data } = useQuery(FETCH_USERS);
    
    console.log('loading', loading);
    console.log('error', error);
    console.log('data', data);
    return (
        <div />
    )
}

export default AppWithData;