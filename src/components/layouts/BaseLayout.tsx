import {Sidebar} from "../sidebar";
import {Player} from "../player";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {QueueState} from "../../store/queue.reducer";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {UserState} from "../../store/user.reducer";
import {Switch} from "@mui/material";

export const BaseLayout = ({ children }: any) => {
    const userState = useSelector<RootState>(state => state.user) as UserState;

    const queue = useSelector<RootState>(root => root.queue) as QueueState;

    return (
        <>
            {!userState.isLogged ? <Navigate to="/login" />
                :
            <div className="h-screen w-screen overflow-hidden">
                <div className="flex items-start h-full">
                    <div className="layout-sidebar h-full"><Sidebar/></div>
                    <div className="w-full h-full flex flex-col">
                        {/*<div className="layout-header h-14 bg-slate-400 mb-5">Header</div>*/}
                        <div className="layout-content-wrapper w-full h-full flex" >
                            <div className="layout-content w-full rounded-2xl pt-5 mx-5 bg-white">
                                {/*{children}*/}
                                <Outlet />
                            </div>

                            {
                                queue.sourceId != null &&
                                <div style={{paddingRight: "30px", minWidth: "430px", marginRight: "-30px", marginBottom: "-15px"}} className="layout-player-wrapper overflow-hidden h-full shadow-xl rounded-3xl bg-white pr-2 pb-2">
                                    <Player/>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            }
        </>

    )
}
