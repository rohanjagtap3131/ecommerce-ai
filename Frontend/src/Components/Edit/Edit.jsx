import { useState } from "react";
import Role from "../../Common/role"
import { IoClose } from "react-icons/io5";
import summuryAPI from "../../Common";
import { toast } from "react-toastify";

export default function Edit({
    name,
    email,
    role,
    _id,
    onClose,
    callFunc,
}) {
    const [userName, setUserName] = useState(name);
    const [userEmail, setUserEmail] = useState(email);
    const [userRole, setUserRole] = useState(role);

    const handelSubmit = async (e) => {
        e.preventDefault();

        const fetchResponse = await fetch(summuryAPI.updateUser(_id).url, {
            method: summuryAPI.updateUser(_id).method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                id: _id,
                name: userName,
                email: userEmail,
                role: userRole,
            }),

        });

        const dataResponse = await fetchResponse.json();

        if (dataResponse.success) {
            toast.success("User updated successfully!");
            onClose();
            callFunc() // close modal
        }
        if (dataResponse.error) {
            dataResponse.error("Update failed: " + dataResponse.message);
        }
    }
    return (
        <div className="mx-auto container px-4  ">


            <div className="bg-white shadow-2xl rounded-lg p-8 max-w-sm mx-auto mt-10">
                <div className="relative p-4 rounded-lg  w-full max-w-md mx-auto">
                    <button className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-black" onClick={onClose}>
                        <IoClose />
                    </button>
                </div>

                <form className="flex flex-col gap-3 my-6" onSubmit={handelSubmit}>
                    <div className="grid">
                        <label htmlFor="">Name :</label>
                        <div className="bg-slate-100 p-2 ">
                            <input className=" rounded-l-md px-4 py-2 w-full h-full outline-none bg-transparent "
                                type="text"
                                placeholder="Enter Email"
                                name="name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required />
                        </div>
                    </div>
                    <div className="grid">
                        <label htmlFor="">Email :</label>
                        <div className="bg-slate-100 p-2 ">
                            <input className=" rounded-l-md px-4 py-2 w-full h-full outline-none bg-transparent "
                                type="email"
                                placeholder="Enter Email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                name="email"
                                required />
                        </div>
                    </div>
                    <div className="grid">
                        <label htmlFor="">Role :</label>
                        <div className="bg-slate-100 p-2 flex items-center justify-center">
                            <select value={userRole} onChange={(e) => setUserRole(e.target.value)} >
                                <option value={Role.ADMIN} key={Role.ADMIN}>{Role.ADMIN}</option>
                                <option value={Role.GENERAL} key={Role.GENERAL}>{Role.GENERAL}</option>
                            </select>
                        </div>

                    </div>

                    <button type="submit" className="bg-yellow-500 - px-4 py-2 rounded-md w-full my-2 hover:bg-yellow-600 transition duration-300">Edit</button>
                </form>

            </div>
        </div>
    )
}