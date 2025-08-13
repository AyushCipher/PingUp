import React, { useRef, useState, useEffect } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { Image as ImageIcon, SendHorizonal, Mic, Phone, Video } from 'lucide-react' // ⬅ Added Phone & Video icons

const ChatBox = () => {
  const [text, setText] = useState('')
  const [images, setImages] = useState([])
  const [audioURL, setAudioURL] = useState(null)
  const [isRecording, setIsRecording] = useState(false)

  const mediaRecorderRef = useRef(null)
  const user = dummyUserData
  const [messages, setMessages] = useState(dummyMessagesData)
  const messagesEndRef = useRef(null)

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      let chunks = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Microphone access denied', err)
    }
  }

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  // Send message
  const sendMessage = () => {
    if (!text.trim() && images.length === 0 && !audioURL) return

    const newMessage = {
      text,
      message_type: images.length > 0 ? 'image' : audioURL ? 'audio' : 'text',
      media_urls:
        images.length > 0
          ? images.map((img) => URL.createObjectURL(img))
          : audioURL
          ? [audioURL]
          : [],
      createdAt: new Date().toISOString(),
      to_user_id: user._id
    }

    setMessages((prev) => [...prev, newMessage])
    setText('')
    setImages([])
    setAudioURL(null)
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 10) {
      alert('You can only attach up to 10 images.')
      return
    }
    setImages((prev) => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-2 md:px-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300">
        {/* Left: User Info */}
        <div className="flex items-center gap-2">
          <img src={user.profile_picture} alt="" className="size-8 sm:size-10 rounded-full" />
          <div className="min-w-0">
            <p className="font-medium text-sm sm:text-base truncate">{user.full_name}</p>
            <p className="text-xs sm:text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        {/* Right: Icons + Menu */}
        <div className="flex items-center gap-6 sm:gap-4 md:gap-5">
          <button className="p-1 sm:p-2 hover:bg-gray-200 rounded-full transition" title="Voice Call">
            <Phone className="w-6 h-6 sm:w-5 sm:h-5 text-gray-700" />
          </button>
          <button className="mr-12 sm:mr-10 md:mr-6 p-2 sm:p-6 hover:bg-gray-200 rounded-full transition" title="Video Call">
            <Video className="w-7 h-7 sm:w-6 sm:h-6 md:w-6 md:h-6 text-gray-700" />
          </button>
        </div>
      </div>



      {/* Messages */}
      <div className="flex-1 p-5 md:p-10 overflow-y-scroll">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages
            .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((message, index) => {
              const isOwnMessage = message.to_user_id === user._id
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-2 text-sm max-w-sm rounded-lg shadow ${
                      isOwnMessage
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 active:scale-95 text-white'
                        : 'bg-white text-slate-700'
                    }`}
                    style={{
                      borderRadius: '12px', 
                    }}
                  >
                    {message.message_type === 'image' &&
                      message.media_urls?.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          className="w-full max-w-sm rounded-lg mb-1"
                          alt=""
                        />
                      ))}

                    {message.message_type === 'audio' &&
                      message.media_urls?.map((url, i) => (
                        <audio key={i} controls src={url} className="mb-1" />
                      ))}

                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              )
            })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="px-4 pb-4">
        <div className="flex flex-col gap-2 max-w-xl mx-auto">
          {/* Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative w-16 h-16">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Field */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 shadow rounded-full px-3 py-1.5 w-full">
            {/* Mic Button */}
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              className={`p-2 rounded-full transition relative ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'hover:bg-gray-100'
              }`}
              title={isRecording ? 'Recording...' : 'Hold to Record'}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <input
              type="text"
              className="flex-1 outline-none text-slate-700 bg-transparent"
              placeholder={isRecording ? 'Recording...' : 'Type a message...'}
              disabled={isRecording}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />

            {/* Image Upload Button */}
            <label
              htmlFor="image"
              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition"
            >
              <ImageIcon className="w-5 h-5 text-gray-500" />
              <input
                type="file"
                id="image"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageSelect}
              />
            </label>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 
                hover:to-purple-800 active:scale-95 cursor-pointer text-white rounded-full transition"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
