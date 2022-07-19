import Head from 'next/head'
import { FC, ReactNode } from 'react'

import config from '../../../config/seo_meta.json'
import { OpenGraphMetaTags } from './OpenGraphMetaTags'
import {
  TwitterCardType,
  TwitterMetaTags,
  TwitterMetaTagsProps,
} from './TwitterMetaTags'

interface Props {
  url?: string
  title?: string
  description?: string
  twitter?: TwitterMetaTagsProps
  robots?: string
  children?: ReactNode
}

export const SEO: FC<Props> = ({
  url,
  title,
  description,
  twitter,
  robots,
  children,
}) => {
  const formattedTitle = title
    ? `${config.titleTemplate.replace(/%s/g, title)}`
    : config.title
  return (
    <>
      <Head>
        <title key="title">{formattedTitle}</title>
        <meta
          key="description"
          name="description"
          content={description ?? config.description}
        />
        <meta key="robots" name="robots" content={robots ?? 'index,follow'} />
        <meta
          key="googlebot"
          name="googlebot"
          content={robots ?? 'index,follow'}
        ></meta>
        <meta
          name="google-site-verification"
          content="0Jp7zERBL5i76DiM-bODvBGgbjuVMEQGSuwOchP_ZnE"
        />
      </Head>

      <TwitterMetaTags
        title={formattedTitle}
        description={description ?? config.description}
        handle={twitter?.handle ?? config.twitter.handle}
        site={twitter?.site ?? config.twitter.site}
        creator={twitter?.creator ?? config.twitter.creator}
        card={twitter?.card ?? (config.twitter.cardType as TwitterCardType)}
        image={twitter?.image ?? config.twitter.image}
      />

      <OpenGraphMetaTags
        type="website"
        url={url ?? process.env.NEXT_PUBLIC_BASE_URL} // default to base url
        title={formattedTitle}
        description={description ?? config.description}
        siteName={config.title}
        image={{
          src:
            (process.env.NEXT_PUBLIC_BASE_URL
              ? process.env.NEXT_PUBLIC_BASE_URL
              : '/') + 'assets/banana-cover.png',
          type: 'image/svg',
          width: '2870',
          height: '1245',
        }}
      />

      <Head>{children}</Head>
    </>
  )
}
