import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: []
}

const messagesSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    }
})

export default messagesSlice.reducer