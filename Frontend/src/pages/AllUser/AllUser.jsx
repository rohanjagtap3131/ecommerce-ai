import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { MdEdit } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

import summuryAPI from "../../Common/index";
import Edit from "../../Components/Edit/Edit";

export default function AllUser() {
    const [allUser, setAllUser] = useState([]);
    const [edit, setEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState({
        name: "",
        email: "",
        role: "",
        _id: ""
    });

    const fetchAllUsers = async () => {
        try {
            const res = await fetch(summuryAPI.allUsers.url, {
                method: summuryAPI.allUsers.method,
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                setAllUser(data.data);
            } else {
                toast.error(data.message || "Failed to fetch users");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <div className="pb-8 px-4 bg-gray-50 min-h-screen">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-2xl font-bold mb-4 text-gray-800"
            >
                All Users
            </motion.h2>

            <div className="overflow-x-auto rounded-xl shadow-md">
                <table className="min-w-full bg-white rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-black text-white text-left">
                            <th className="py-3 px-4">Sr.</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Created</th>
                            <th className="py-3 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUser.map((user, index) => (
                            <motion.tr
                                key={user._id}
                                whileHover={{ scale: 1.01 }}
                                className="border-b hover:bg-gray-100 transition-all"
                            >
                                <td className="py-3 px-4">{index + 1}</td>
                                <td className="py-3 px-4 capitalize">{user.name}</td>
                                <td className="py-3 px-4">{user.email}</td>
                                <td className="py-3 px-4 uppercase">{user.role}</td>
                                <td className="py-3 px-4">{moment(user.createdAt).format('YYYY-MM-DD hh:mm:ss a')}</td>
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setEdit(true);
                                        }}
                                        className="bg-green-100 text-green-800 hover:bg-green-500 hover:text-white p-2 rounded-full transition-all"
                                    >
                                        <MdEdit size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {edit && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Edit
                                name={selectedUser.name}
                                email={selectedUser.email}
                                role={selectedUser.role}
                                _id={selectedUser._id}
                                onClose={() => setEdit(false)}
                                callFunc={fetchAllUsers}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
