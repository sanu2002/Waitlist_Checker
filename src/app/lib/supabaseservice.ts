import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://djqumgsmexqbcvqzspke.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcXVtZ3NtZXhxYmN2cXpzcGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNDUxNzAsImV4cCI6MjA3MzYyMTE3MH0.BtiAxXtDMHLAz86R15Hpz0Fd43cb40V0AHMK1illXpg"
const supabase = createClient(supabaseUrl, supabaseKey!)

const{data,error}=await supabase
.from('waitlist')
.select()


export {data,error}

const {data}=await supabase
.from('waitlist')
.insert({
    evm_address:"we will take input",email:"we will take from input",discord:"..",
    telegram_handle:"telegram handle"
})
