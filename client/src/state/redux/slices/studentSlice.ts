import {createSlice, type PayloadAction} from "@reduxjs/toolkit"

interface StudentState{
    id: string | null;
    name: string | null;
    email: string | null;
    class: string | null;
    avatarUrl?: string | null;
}

const initialState: StudentState={
    id:null,
    name:null,
    email:null,
    class:null,
    avatarUrl:null
}

const studentSlice = createSlice({
    name:"student",
    initialState,
    reducers:{
        setStudent:(state, action: PayloadAction<{id:string; name:string; email:string;class:string; avatarUrl?:string}>)=>{
            state.id= action.payload.id;
            state.name= action.payload.name;
            state.email= action.payload.email;
            state.class= action.payload.class;
            state.avatarUrl=action.payload.avatarUrl;
        },
        clearStudent:(state)=>{
            state.id=null;
            state.name=null;
            state.email=null;
            state.class=null;
            state.avatarUrl=null;
        }
    }
})

export const {setStudent, clearStudent} = studentSlice.actions
export default studentSlice