import React from 'react';
import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';

const AppWithData = () => {
    const HELLO_WORLD = gql`
        {
            hello
        }
    `;
    const { loading, error, data } = useQuery(HELLO_WORLD);
    
    console.log('loading', loading);
    console.log('error', error);
    console.log('data', data);
    return (
        <div />
    )
}

export default AppWithData;