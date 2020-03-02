import { Context } from "@actions/github/lib/context";
import { GitHub } from "@actions/github";
import { AnyResponse, Response, ReposDeleteReleaseAssetResponse, ReposListAssetsForReleaseResponse, ReposCreateReleaseResponse, ReposGetReleaseByTagResponse, ReposListReleasesResponse } from "@octokit/rest";

export interface Releases {
    create(
        tag: string,
        body?: string,
        commitHash?: string,
        draft?: boolean,
        name?: string,
        prerelease?: boolean
    ): Promise<Response<ReposCreateReleaseResponse>>

    deleteArtifact(assetId: number): Promise<Response<ReposDeleteReleaseAssetResponse>>

    getByTag(tag: string): Promise<Response<ReposGetReleaseByTagResponse>>

    listArtifactsForRelease(releaseId: number): Promise<Response<ReposListAssetsForReleaseResponse>>

    listReleases(): Promise<Response<ReposListReleasesResponse>>

    update(
        id: number,
        tag: string,
        body?: string,
        commitHash?: string,
        draft?: boolean,
        name?: string,
        prerelease?: boolean
    ): Promise<Response<ReposCreateReleaseResponse>>

    uploadArtifact(
        assetUrl: string,
        contentLength: number,
        contentType: string,
        file: string | object,
        name: string
    ): Promise<Response<AnyResponse>>
}

export class GithubReleases implements Releases {
    context: Context
    git: GitHub

    constructor(context: Context, git: GitHub) {
        this.context = context
        this.git = git
    }

    async create(
        tag: string,
        body?: string,
        commitHash?: string,
        draft?: boolean,
        name?: string,
        prerelease?: boolean
    ): Promise<Response<ReposCreateReleaseResponse>> {
        return this.git.repos.createRelease({
            body: body,
            name: name,
            draft: draft,
            owner: this.context.repo.owner,
            prerelease: prerelease,
            repo: this.context.repo.repo,
            target_commitish: commitHash,
            tag_name: tag
        })
    }

    async deleteArtifact(
        assetId: number
    ): Promise<Response<ReposDeleteReleaseAssetResponse>> {
        return this.git.repos.deleteReleaseAsset({
            asset_id: assetId,
            owner: this.context.repo.owner,
            repo: this.context.repo.repo
        })
    }

    async listArtifactsForRelease(
        releaseId: number
    ): Promise<Response<ReposListAssetsForReleaseResponse>> {
        return this.git.repos.listAssetsForRelease({
            owner: this.context.repo.owner,
            release_id: releaseId,
            repo: this.context.repo.repo
        })
    }

    async listReleases(): Promise<Response<ReposListReleasesResponse>> {
        return this.git.repos.listReleases({
            owner: this.context.repo.owner,
            repo: this.context.repo.repo
        })
    }

    async getByTag(tag: string): Promise<Response<ReposGetReleaseByTagResponse>> {
        return this.git.repos.getReleaseByTag({
            owner: this.context.repo.owner,
            repo: this.context.repo.repo,
            tag: tag
        })
    }

    async update(
        id: number,
        tag: string,
        body?: string,
        commitHash?: string,
        draft?: boolean,
        name?: string,
        prerelease?: boolean
    ): Promise<Response<ReposCreateReleaseResponse>> {
        return this.git.repos.updateRelease({
            release_id: id,
            body: body,
            name: name,
            draft: draft,
            owner: this.context.repo.owner,
            prerelease: prerelease,
            repo: this.context.repo.repo,
            target_commitish: commitHash,
            tag_name: tag
        })
    }

    async uploadArtifact(
        assetUrl: string,
        contentLength: number,
        contentType: string,
        file: string | object,
        name: string
    ): Promise<Response<AnyResponse>> {
        return this.git.repos.uploadReleaseAsset({
            url: assetUrl,
            headers: {
                "content-length": contentLength,
                "content-type": contentType
            },
            file: file,
            name: name
        })
    }
}
