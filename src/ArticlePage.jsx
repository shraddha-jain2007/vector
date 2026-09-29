import {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import {PortableText} from '@portabletext/react'
import {client} from './sanityClient'

const query = `*[_type == "post" && slug.current == $slug][0]{
  title, author, authorLinkedIn, topic, publishedAt, body,
  "imageUrl": mainImage.asset->url
}`

export default function ArticlePage() {
  const {slug} = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.fetch(query, {slug}).then((data) => {
      setPost(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center">Loading...</div>
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center gap-4">
        <p>Article not found.</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300">Back to home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-900 text-white font-mono px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-block">← Back to Articles</Link>

        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-8" />
        )}

        {post.topic && <p className="text-purple-400 mb-2">{post.topic}</p>}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-400 mb-10">
          By{' '}
          {post.authorLinkedIn ? (
            <a href={post.authorLinkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              {post.author}
            </a>
          ) : (
            post.author
          )}
        </p>

        <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed">
          <PortableText value={post.body} />
        </div>
      </div>
    </div>
  )
}