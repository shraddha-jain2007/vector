import {useEffect, useState} from 'react'
import {client} from './sanityClient'
import {Link} from 'react-router-dom'

const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id, title, author, authorLinkedIn, topic, excerpt, publishedAt,"slug": slug.current,
  "imageUrl": mainImage.asset->url
}`

export default function Blogs() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.fetch(query).then(setPosts).finally(() => setLoading(false))
  }, [])

  return (
    <section className="px-6 py-16 bg-stone-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Articles</h2>
          <p className="text-xl text-gray-400">Written by our members</p>
        </div>

        {loading && <p className="text-center text-gray-400">Loading...</p>}
        {!loading && posts.length === 0 && (
          <p className="text-center text-gray-400">No articles yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {posts.map((post) => (
            <Link key={post._id} to={`/articles/${post.slug}`} className="bg-stone-800 border border-gray-600 rounded-xl overflow-hidden max-w-sm hover:bg-stone-700 transition-all duration-300 block">
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                {post.topic && <p className="text-sm text-purple-400 mb-2">{post.topic}</p>}
                <h3 className="text-xl font-semibold mb-2 text-white">{post.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                <p className="text-gray-300 text-sm">
                  By{' '}
                  {post.authorLinkedIn ? (
                    <a href={post.authorLinkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      {post.author}
                    </a>
                  ) : (
                    post.author
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}