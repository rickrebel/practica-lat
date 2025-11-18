import { defineStore } from 'pinia'
import * as d3 from 'd3'

// Type definitions
interface Institution {
  name: string
  // Add other institution properties as needed
  [key: string]: any
}

interface Material {
  // Define material properties based on your data structure
  [key: string]: any
}

interface Document {
  date_start: string
  slug?: string
  full_slug?: string
  // Add other document properties as needed
  [key: string]: any
}

interface Story {
  content: {
    document: Document[]
  }
  slug: string
  full_slug: string
  // Add other story properties as needed
  [key: string]: any
}

interface Project {
  // Define project properties based on your data structure
  [key: string]: any
}

interface Axis {
  // Define eje properties based on your data structure
  [key: string]: any
}

interface GlobalConfig {
  // Define config properties based on your data structure
  [key: string]: any
}

interface ApiResponse<T = any> {
  data: T
}

interface UseApiReturn {
  post: (url: string, data?: any, config?: any) => Promise<ApiResponse>
}

// Store state interface
interface WebStoreState {
  counter: number
  institutions: Institution[]
  materials: Material[]
  documents: Document[]
  all_documents: Document[]
  all_projects: Project[]
  main_projects: Project[]
  all_axes: Axis[]
  global_config: GlobalConfig | null
}

// Declare the useApi composable (you'll need to import this or define it)
declare function useApi(): UseApiReturn

export const useWebStore = defineStore('web', {
  state: (): WebStoreState => ({
    counter: 0,
    institutions: [],
    materials: [],
    documents: [],
    all_documents: [],
    all_projects: [],
    main_projects: [],
    all_axes: [],
    global_config: null,
  }),

  actions: {
    async sendResponse(data: any): Promise<any> {
      try {
        const { post } = useApi()
        const response = await post(`/oej/response/`, data)
        return response.data
      } catch (error) {
        console.error(error)
        throw error // Re-throw to allow caller to handle
      }
    },

    async saveFile([response_id, file_data]: [string | number, FormData]): Promise<any> {
      try {
        console.log('response_id', response_id)
        const { post } = useApi()

        const response = await post(
          `/oej/response/${response_id}/add_file/`,
          file_data,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        return response.data
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    setInstitutions(institutions: { body: Institution[] }): void {
      this.institutions = institutions.body.sort((a, b) => d3.ascending(a.name, b.name))
    },

    setMaterials(materials: Material[]): void {
      this.materials = materials
    },

    setDocuments(documents: Document[]): void {
      this.documents = documents
    },

    setAllDocuments(stories: Story[]): void {
      let documents = stories.reduce((acc: Document[], story) => {
        if (story.content.document.length > 0) {
          const doc = { ...story.content.document[0] } // Create a copy to avoid mutations
          doc.slug = story.slug
          doc.full_slug = story.full_slug
          acc.push(doc)
        }
        return acc
      }, [])

      documents = documents.sort((a, b) => d3.descending(a.date_start, b.date_start))
      this.all_documents = documents
    },

    setAllProjects(stories: Story[]): void {
      // this.all_projects = stories.reduce((acc: Project[], story) => {
      //   acc.push(story)
      //   return acc
      // }, [])
      // console.log('setting projects', stories)
      this.all_projects = stories
    },

    setAllAxes(axes: Axis[]): void {
      // console.log('setting agendas', agendas)
      this.all_axes = axes
    },

    setGlobalConfig(config: GlobalConfig): void {
      // console.log('setting footer config', config)
      this.global_config = config
    }
  },

  getters: {
    getCounter(): number {
      return this.counter
    }
  }
})

// Export the store type for use in other files
export type WebStore = ReturnType<typeof useWebStore>