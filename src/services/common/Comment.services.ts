// src/services/common/Comment.services.ts

import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { CommentResponse, CreateCommentPayload, Comment } from "../../types/common/Comment.types";
import HttpService from "./HttpService";

class CommentService {
  
  // Get all comments by table name and record ID
  static async getByTableAndId(
    tableName: string,
    recordId: number | string
  ): Promise<CommentResponse> {
    return HttpService.callApi(
      API_ENDPOINTS.COMMENT.GET_BY_TABLE_AND_ID(tableName, Number(recordId)),
      "GET"
    );
  }

  // Create a new comment
  static async create(payload: CreateCommentPayload): Promise<CommentResponse> {
    return HttpService.callApi(
      API_ENDPOINTS.COMMENT.CREATE,
      "POST",
      payload
    );
  }

  // Delete a comment
  static async delete(CommentId: number, deletedBy: string): Promise<CommentResponse> {
    return HttpService.callApi(
      API_ENDPOINTS.COMMENT.DELETE(CommentId, deletedBy),
      "DELETE"
    );
  }

  // Get comments from model
  static async getCommentsFromModel(
    model: Pick<Comment, "tableName" | "recordID">
  ): Promise<CommentResponse> {
    return HttpService.callApi(
      API_ENDPOINTS.COMMENT.GET_BY_TABLE_AND_ID(model.tableName, model.recordID),
      "GET"
    );
  }
}

export default CommentService;