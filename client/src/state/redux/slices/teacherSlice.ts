import {createSlice, type PayloadAction} from "@reduxjs/toolkit"

interface TeacherState{
    id: string | null;
    name: string | null;
    email: string | null;
    avatarUrl: string | null;
}

const initialState: TeacherState={
    id:null,
    name:null,
    email:null,
    avatarUrl:null
}

const teacherSlice = createSlice({
    name:"teacher",
    initialState,
    reducers:{
        setTeacher:(state, action: PayloadAction<{id:string; name:string; email:string; avatarUrl:string}>)=>{
            state.id= action.payload.id;
            state.name= action.payload.name;
            state.email= action.payload.email;
            state.avatarUrl=action.payload.avatarUrl;
        },
        clearTeacher:(state)=>{
            state.id=null;
            state.name=null;
            state.email=null;
            state.avatarUrl=null;
        }
    }
})

export const {setTeacher, clearTeacher} = teacherSlice.actions
export default teacherSlice