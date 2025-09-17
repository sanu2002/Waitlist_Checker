'use client'

import { createClient } from '@supabase/supabase-js'
import { useState, FormEvent } from 'react'

// Initialize Supabase client (use environment variables in production)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://djqumgsmexqbcvqzspke.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcXVtZ3NtZXhxYmN2cXpzcGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNDUxNzAsImV4cCI6MjA3MzYyMTE3MH0.BtiAxXtDMHLAz86R15Hpz0Fd43cb40V0AHMK1illXpg"
const supabase = createClient(supabaseUrl, supabaseKey)
export default function Home() {
  const [email, setEmail] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [discord, setDiscord] = useState<string>("")
  const [x, setX] = useState<string>("")
  const [telegram, setTelegram] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [checkAddress, setCheckAddress] = useState<string>("")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [showQuickCheckModal, setShowQuickCheckModal] = useState<boolean>(false)
  const [quickCheckAddress, setQuickCheckAddress] = useState<string>("")
  const [quickCheckMessage, setQuickCheckMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !address) {
      setError("Email and address are required")
      return
    }

    setIsLoading(true)
    setError(null)

    const { data: existingUsers, error: fetchError } = await supabase
      .from('waitlist')
      .select('email, evm_address')
      .or(`email.eq.${email},evm_address.eq.${address}`)

    if (fetchError) {
      setError("Error checking existing users: " + fetchError.message)
      setIsLoading(false)
      return
    }

    if (existingUsers && existingUsers.length > 0) {
      setError("A user with this email or address already exists!")
      setIsLoading(false)
      return
    }

    const newEntry = {
      evm_address: address,
      email: email,
      discord: discord,
      telegram_handle: telegram,
      x_handle: x
    }

    const { error: insertError } = await supabase.from('waitlist').insert([newEntry])

    if (insertError) {
      setError(insertError.message)
    } else {
      setSubmitted(true)
      setEmail("")
      setAddress("")
      setDiscord("")
      setX("")
      setTelegram("")
    }
    setIsLoading(false)
  }

  const checkStatus = async () => {
    if (!checkAddress) {
      setStatusMessage("Please enter an address to check!")
      return
    }

    setIsLoading(true)
    const { data: existingUsers, error: fetchError } = await supabase
      .from('waitlist')
      .select('evm_address')
      .eq('evm_address', checkAddress)

    if (fetchError) {
      setStatusMessage("Error checking status: " + fetchError.message)
    } else if (existingUsers && existingUsers.length > 0) {
      setStatusMessage("This address is already on the waitlist!")
    } else {
      setStatusMessage("This address is not on the waitlist.")
    }
    setIsLoading(false)
  }

  const quickCheckStatus = async () => {
    if (!quickCheckAddress) {
      setQuickCheckMessage("Please enter a wallet address!")
      return
    }

    setIsLoading(true)
    const { data: existingUsers, error: fetchError } = await supabase
      .from('waitlist')
      .select('evm_address')
      .eq('evm_address', quickCheckAddress)

    if (fetchError) {
      setQuickCheckMessage("Error checking status: " + fetchError.message)
    } else if (existingUsers && existingUsers.length > 0) {
      setQuickCheckMessage("This address is already on the waitlist!")
    } else {
      setQuickCheckMessage("This address is not on the waitlist.")
    }
    setIsLoading(false)
  }

  const handleQuickCheck = async () => {
    await quickCheckStatus()
    setShowQuickCheckModal(true)
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-6 relative">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🚀 Join Our Waitlist
        </h1>
        <p className="text-gray-600 mb-6">
          Be the first to know when we launch. Enter your email below:
        </p>

        {/* Quick Check Field */}
    

        {submitted ? (
          <div className="text-green-600 font-semibold">
            ✅ Thanks for joining the waitlist!
            <button
              onClick={() => setShowModal(true)}
              className="ml-2 text-blue-600 underline hover:text-blue-800"
            >
              Check Status
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Your address"
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              required
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              placeholder="Enter Your Discord handle"
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              required
              value={x}
              onChange={(e) => setX(e.target.value)}
              placeholder="Enter Your X Handle"
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              required
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="Enter Your Telegram handle"
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {error && <p className="text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
        )}



        <div className="mb-6 flex items-center justify-center mt-10 gap-2">
          <input
            type="text"
            value={quickCheckAddress}
            onChange={(e) => setQuickCheckAddress(e.target.value)}
            placeholder="Paste wallet address"
            className="w-full max-w-xs rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleQuickCheck}
            disabled={isLoading}
            className={`bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Checking...' : 'Check'}
          </button>
        </div>





      </div>


        



      {/* Existing Modal for Post-Submission Check */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Check Waitlist Status</h2>
            <input
              type="text"
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
              placeholder="Enter address to check"
              className="w-full rounded-lg border border-gray-300 p-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              autoFocus
            />
            {statusMessage && <p className={statusMessage.includes("Error") ? "text-red-600" : "text-green-600"}>{statusMessage}</p>}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => {
                  setShowModal(false)
                  setCheckAddress("")
                  setStatusMessage(null)
                }}
                className="bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={checkStatus}
                disabled={isLoading}
                className={`bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Checking...' : 'Check'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Check Modal */}
      {showQuickCheckModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Check Status</h2>
            <p className={quickCheckMessage?.includes("Error") ? "text-red-600" : "text-green-600"}>{quickCheckMessage}</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => {
                  setShowQuickCheckModal(false)
                  setQuickCheckAddress("")
                  setQuickCheckMessage(null)
                }}
                className="bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}