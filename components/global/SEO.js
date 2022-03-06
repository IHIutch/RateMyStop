import React from 'react'

export default function SEO({
  title = 'Rate My Stop',
  description = 'Rate My Stop is a way for the public and transportation organizations to improve their communities by understanding the needs of their transportation system.',
  image = '/meta.jpg',
  path = '',
}) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}${path}`
  const attrs = [
    {
      name: 'title',
      content: title,
    },
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:url',
      content: url,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: image,
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:title',
      content: title,
    },
    {
      property: 'twitter:url',
      content: url,
    },
    {
      property: 'twitter:description',
      content: description,
    },
    {
      property: 'twitter:image',
      content: image,
    },
  ]

  return (
    <>
      <title>{title}</title>
      {attrs
        .filter((attr) => attr.content)
        .map((attr, idx) => (
          <meta key={idx} {...attr} />
        ))}
    </>
  )
}
