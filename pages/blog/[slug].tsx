import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { Box, Container, Text, Subtitle, Flex, Link, Separator } from '@modulz/design-system';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { MDXProvider, components } from '@components/MDXComponents';
import { parseISO, format } from 'date-fns';
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx';
import { authors } from '@data/authors';
import { Color } from '@components/Color';

import type { Frontmatter } from 'types/frontmatter';

type Doc = {
  frontmatter: Frontmatter;
  code: any;
};

export default function BlogPostPage({ frontmatter, code }: Doc) {
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  return (
    <>
      <TitleAndMetaTags
        title={`${frontmatter.metaTitle} — Radix UI`}
        description={frontmatter.metaDescription}
        image={frontmatter.metaImage}
      />

      <Box
        css={{
          py: '$5',

          '@bp2': { pt: '$8', pb: '$9', pl: '250px' },
          '@bp3': { pr: '250px' },
        }}
      >
        <Container size="3" css={{ maxWidth: '780px', position: 'relative' }}>
          <Text as="h1" size="8" css={{ fontWeight: 500, mb: '$2', lineHeight: '40px' }}>
            {frontmatter.metaTitle}
          </Text>
          <Subtitle as="p" css={{ mt: '$2', mb: '$7' }}>
            {frontmatter.metaDescription}
          </Subtitle>

          <Flex css={{ mt: '$4', mb: '$7', alignItems: 'center' }}>
            <Text as="p" size="3" css={{ color: '$slate900', lineHeight: 0, whiteSpace: 'nowrap' }}>
              <Link
                href={`https://twitter.com/${authors[frontmatter.by || 'pedro'].twitter}`}
                rel="noopener noreferrer"
                variant="subtle"
              >
                {authors[frontmatter.by || 'pedro'].name}
              </Link>
            </Text>
            <Separator orientation="vertical" css={{ mx: '$2' }} />
            <Text
              as="time"
              size="3"
              css={{ color: '$slate900', lineHeight: 0, whiteSpace: 'nowrap' }}
            >
              {format(parseISO(frontmatter.publishedAt), 'MMMM yyyy')}
            </Text>
            <Flex css={{ alignItems: 'center', display: 'none', '@bp2': { display: 'flex' } }}>
              <Separator orientation="vertical" css={{ mx: '$2' }} />
              <Text size="3" css={{ color: '$slate900', lineHeight: 0 }}>
                {frontmatter.readingTime.text}
              </Text>
            </Flex>
          </Flex>

          <MDXProvider frontmatter={frontmatter}>
            <Component components={{ ...components, Color } as any} />
          </MDXProvider>
        </Container>
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('blog');

  return {
    paths: frontmatters.map((frontmatter) => ({
      params: { slug: frontmatter.slug.replace('blog/', '') },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('blog/', context.params.slug);
  return { props: { frontmatter, code } };
}
