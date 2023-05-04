import {Sidebar} from "../sidebar";
import {Player} from "../player";
import React from "react";

export const BaseLayout = ({ children }: any) => {

    return (
        <div className="h-screen w-screen overflow-hidden">
            <div className="flex items-start h-full">
                <div className="layout-sidebar h-full"><Sidebar/></div>
                <div className="w-full h-full">
                    <div className="layout-header h-14 bg-slate-400 mb-5">Header</div>
                    <div className="layout-content-wrapper w-full h-full flex">
                        <div className="layout-content w-full">
                            {children}
                        </div>
                        <div style={{paddingRight: "30px", minWidth: "430px", marginRight: "-30px", marginBottom: "-15px"}} className="layout-player-wrapper overflow-hidden h-full shadow-xl rounded-3xl bg-white pr-2 pb-2">
                            <Player/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
