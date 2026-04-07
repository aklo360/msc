/**
 * Metaobject type definitions for the MSC CMS.
 * All text fields are plain text (single_line / multi_line), NOT rich text.
 */

export interface FieldDefinition {
  key: string;
  name: string;
  type: string;
  description?: string;
}

export interface MetaobjectDefinition {
  type: string;
  name: string;
  description: string;
  fieldDefinitions: FieldDefinition[];
}

export const DEFINITIONS: MetaobjectDefinition[] = [
  {
    type: 'art_exhibition',
    name: 'Art Exhibition',
    description:
      'Art exhibitions, shows, and presentations by Mr.StarCity',
    fieldDefinitions: [
      {key: 'title', name: 'Title', type: 'single_line_text_field'},
      {
        key: 'type',
        name: 'Exhibition Type',
        type: 'single_line_text_field',
        description: 'e.g. Solo Exhibition, Group Show, Solo Presentation',
      },
      {key: 'venue', name: 'Venue', type: 'single_line_text_field'},
      {key: 'location', name: 'Location', type: 'single_line_text_field'},
      {
        key: 'date_range',
        name: 'Date Range',
        type: 'single_line_text_field',
        description: 'e.g. Feb–Sep, 2025',
      },
      {
        key: 'series_tag',
        name: 'Series Tag',
        type: 'single_line_text_field',
        description: 'e.g. Solo, Group',
      },
      {
        key: 'description',
        name: 'Description',
        type: 'multi_line_text_field',
        description: 'Short exhibition description',
      },
      {
        key: 'body',
        name: 'Body',
        type: 'multi_line_text_field',
        description: 'Extended text, poems, quotes',
      },
      {
        key: 'featured_image',
        name: 'Featured Image',
        type: 'file_reference',
      },
      {key: 'images', name: 'Images', type: 'list.file_reference'},
    ],
  },
  {
    type: 'project',
    name: 'Project',
    description:
      'Design projects, collaborations, and creative work by Mr.StarCity',
    fieldDefinitions: [
      {key: 'title', name: 'Title', type: 'single_line_text_field'},
      {
        key: 'category',
        name: 'Category',
        type: 'single_line_text_field',
        description:
          'e.g. Public Art Installation, Fashion Collaboration, Jewelry',
      },
      {
        key: 'collaborator',
        name: 'Collaborator',
        type: 'single_line_text_field',
      },
      {key: 'location', name: 'Location', type: 'single_line_text_field'},
      {key: 'year', name: 'Year', type: 'single_line_text_field'},
      {
        key: 'series_tag',
        name: 'Series Tag',
        type: 'single_line_text_field',
      },
      {
        key: 'description',
        name: 'Description',
        type: 'multi_line_text_field',
      },
      {key: 'body', name: 'Body', type: 'multi_line_text_field'},
      {
        key: 'featured_image',
        name: 'Featured Image',
        type: 'file_reference',
      },
      {key: 'images', name: 'Images', type: 'list.file_reference'},
      {
        key: 'links',
        name: 'Links',
        type: 'json',
        description: 'Array of {label, url} objects',
      },
      {
        key: 'inquiry_email',
        name: 'Inquiry Email',
        type: 'single_line_text_field',
      },
    ],
  },
  {
    type: 'editorial',
    name: 'Editorial',
    description: 'Press articles, reviews, and features about Mr.StarCity',
    fieldDefinitions: [
      {key: 'title', name: 'Title', type: 'single_line_text_field'},
      {
        key: 'source',
        name: 'Source',
        type: 'single_line_text_field',
        description: 'e.g. Juxtapoz, Vogue Philippines',
      },
      {
        key: 'category',
        name: 'Category',
        type: 'single_line_text_field',
        description: 'e.g. Feature, Review, Interview, Profile',
      },
      {
        key: 'date',
        name: 'Date',
        type: 'single_line_text_field',
        description: 'e.g. Feb, 2025',
      },
      {key: 'tag', name: 'Tag', type: 'single_line_text_field'},
      {key: 'external_url', name: 'External URL', type: 'url'},
      {
        key: 'description',
        name: 'Description',
        type: 'multi_line_text_field',
      },
      {key: 'body', name: 'Body', type: 'multi_line_text_field'},
      {
        key: 'featured_image',
        name: 'Featured Image',
        type: 'file_reference',
      },
      {key: 'images', name: 'Images', type: 'list.file_reference'},
    ],
  },
  {
    type: 'music_entry',
    name: 'Music Entry',
    description: 'Music releases, playlists, and embeds',
    fieldDefinitions: [
      {key: 'title', name: 'Title', type: 'single_line_text_field'},
      {
        key: 'type',
        name: 'Type',
        type: 'single_line_text_field',
        description: 'e.g. Spotify, YouTube, Playlist',
      },
      {key: 'embed_url', name: 'Embed URL', type: 'url'},
      {
        key: 'description',
        name: 'Description',
        type: 'multi_line_text_field',
      },
      {key: 'body', name: 'Body', type: 'multi_line_text_field'},
      {
        key: 'featured_image',
        name: 'Featured Image',
        type: 'file_reference',
      },
      {key: 'images', name: 'Images', type: 'list.file_reference'},
      {
        key: 'release_date',
        name: 'Release Date',
        type: 'single_line_text_field',
      },
    ],
  },
];
