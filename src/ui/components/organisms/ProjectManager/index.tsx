// import faBox from "@fortawesome/fontawesome-free-solid/faBox"
// import faCog from "@fortawesome/fontawesome-free-solid/faCog"
// import Icon from "@fortawesome/react-fontawesome"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import FaBox from "react-icons/io/ios-box"
import { lifecycle } from "recompose"
import styled from "styled-components"
import { connector } from "../../../reducers"
import { CloneProjectButton } from "./CloneProjectButton"
import { CreateNewProjectButton } from "./CreateNewProjectButton"
import { ProjectContextMenu } from "./ProjectContextMenu"

export const ProjectManager = connector(
  state => {
    return {
      project: state.project,
      repository: state.repository
    }
  },
  actions => {
    return {
      loadProjectList: actions.project.loadProjectList,
      projectRootChanged: actions.repository.projectRootChanged,
      createNewProject: actions.project.createNewProject,
      cloneFromGitHub: actions.project.cloneFromGitHub,
      deleteProject: actions.repository.deleteProject,
      pushScene: actions.app.pushScene
    }
  },
  lifecycle({
    componentDidMount() {
      ;(this as any).props.loadProjectList()
    }
  })
)(props => {
  const {
    createNewProject,
    cloneFromGitHub,
    project: { projects }
  } = props
  return (
    <>
      <ProjectContextMenu />
      <fieldset>
        <legend>repository</legend>
        <CreateNewProjectButton
          onClickCreate={dirname => {
            const newProjectRoot = path.join("/", dirname)
            createNewProject(newProjectRoot)
          }}
        />
        &nbsp;
        <CloneProjectButton
          onClickClone={dirname => {
            const clonePath =
              "https://" +
              path.join("cors-buster-tbgktfqyku.now.sh/github.com", dirname)
            const [, repoName] = dirname.split("/")
            const projectRoot = path.join("/", repoName)
            cloneFromGitHub(projectRoot, clonePath)
          }}
        />
        {projects.map(p => {
          const isActive = p.projectRoot === props.repository.currentProjectRoot
          return (
            <ContextMenuProvider
              key={p.projectRoot}
              id="project"
              data={{ dirpath: p.projectRoot }}
            >
              <ProjectLineContainer
                onClick={() => {
                  props.projectRootChanged(p.projectRoot)
                }}
              >
                <ProjectLineContent>
                  <FaBox />
                  <span
                    style={{
                      color: isActive ? "#4a4" : "black"
                    }}
                  >
                    {p.projectRoot}
                  </span>
                </ProjectLineContent>
              </ProjectLineContainer>
            </ContextMenuProvider>
          )
        })}
      </fieldset>
    </>
  )
})

const ProjectLineContainer = styled.div`
  padding: 3px;
`

const ProjectLineContent = styled.div`
  outline: 1px solid black;
  padding: 2px;
  color: green;
  /* background: #fff; */
  &:hover {
    color: #fff;
    /* background: #888; */
  }
`
