export default function Loading() {
    return (<div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#d63736] border-t-transparent rounded-full inline-block mb-4"></div>
        <p>Loading ...</p>
      </div>
    </div>)
  }
  