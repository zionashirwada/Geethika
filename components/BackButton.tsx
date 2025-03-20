import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
    
}

const BackButton = (props: Props) => {
  const router = useRouter()
    return (
         <div className="mb-6">
         <Button
           variant="outline"
           className="flex items-center gap-2 rounded-xl"
           onClick={() => router.back()}
         >
           <ArrowLeft className="h-4 w-4" />
           Back
         </Button>
       </div>
    )
}

export default BackButton
