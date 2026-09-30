import {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import {client} from './sanityClient'

const query = `*[_type == "post" && slug.current == $slug][0]{
  title, author, authorLinkedIn, topic, publishedAt,
  "pdfUrl": pdfFile.asset->url
}`

export default function ArticlePage() {
  const {slug} = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    client.fetch(query, {slug}).then(setPost).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p className="text-center text-gray-400 py-20">Loading...</p>
  if (!post) return <p className="text-center text-gray-400 py-20">Article not found.</p>

  return (
    <section className="px-6 py-12 bg-stone-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link to="/articles" className="text-purple-400 hover:text-purple-300 text-sm">
          ← Back to articles
        </Link>

        {post.topic && <p className="text-sm text-purple-400 mt-6">{post.topic}</p>}
        <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-2">{post.title}</h1>

        <p className="text-gray-400 mb-6">
          By{' '}
          {post.authorLinkedIn ? (
            <a href={post.authorLinkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              {post.author}
            </a>
          ) : (
            post.author
          )}
          {post.publishedAt && ` · ${new Date(post.publishedAt).toLocaleDateString()}`}
        </p>

        {post.pdfUrl ? (
          <>
            <iframe
              src={post.pdfUrl}
              title={post.title}
              className="w-full h-[80vh] rounded-xl border border-gray-600 bg-white"
            />
            <a href={post.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-blue-400 hover:text-blue-300">
              Open / download PDF
            </a>
          </>
        ) : (
          <p className="text-gray-400">No PDF attached to this article yet.</p>
        )}
      </div>
    </section>
  )
}