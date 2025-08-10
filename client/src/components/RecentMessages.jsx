import React, { useState, useEffect } from 'react';
import { dummyRecentMessagesData } from '../assets/assets';
import { Link } from 'react-router-dom';
import moment from 'moment';

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);

  const fetchRecentMessages = async () => {
    setMessages(dummyRecentMessagesData);
  };

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  return (
    <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800">
      <h3 className="font-semibold text-slate-800 mb-4">Recent Messages</h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => (
          <Link
            key={index}
            to={`/messages/${message.from_user_id._id}`} // optional: link to chat
            className="flex items-start gap-2 py-2 hover:bg-slate-100 rounded-md px-2"
          >
            <img
              src={message.from_user_id.profile_picture}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex flex-col w-full">
              {/* Top: Name and Time */}
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm">
                  {message.from_user_id.full_name}
                </p>
                <p className="text-slate-500 text-[10px]">
                  {moment(message.createdAt).fromNow()}
                </p>
              </div>

              {/* Bottom: Message Preview + Unread Badge */}
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-slate-700 truncate max-w-[85%]">
                  {message.text ? message.text : 'Media'}
                </p>
                {!message.seen && (
                  <div className="bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px] ml-2">
                    1
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
