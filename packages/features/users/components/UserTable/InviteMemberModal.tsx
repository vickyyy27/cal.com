import { useSession } from "next-auth/react";
import type { Dispatch } from "react";

import MemberInvitationModal from "@calcom/features/ee/teams/components/MemberInvitationModal";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc";
import { showToast } from "@calcom/ui";

import type { Action } from "./UserListTable";

interface Props {
  dispatch: Dispatch<Action>;
}

export function InviteMemberModal(props: Props) {
  const { data: session } = useSession();
  const { t, i18n } = useLocale();
  const inviteMemberMutation = trpc.viewer.teams.inviteMember.useMutation({
    async onSuccess(data) {
      props.dispatch({ type: "CLOSE_MODAL" });
      if (data.sendEmailInvitation) {
        if (Array.isArray(data.usernameOrEmail)) {
          showToast(
            t("email_invite_team_bulk", {
              userCount: data.usernameOrEmail.length,
            }),
            "success"
          );
        } else {
          showToast(
            t("email_invite_team", {
              email: data.usernameOrEmail,
            }),
            "success"
          );
        }
      }
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  if (!session?.user.organizationId) return null;

  const orgId = session.user.organizationId;

  return (
    <MemberInvitationModal
      members={[]}
      isOpen={true}
      onExit={() => {
        props.dispatch({
          type: "CLOSE_MODAL",
        });
      }}
      teamId={orgId}
      isLoading={inviteMemberMutation.isLoading}
      onSubmit={(values) => {
        inviteMemberMutation.mutate({
          teamId: orgId,
          language: i18n.language,
          role: values.role,
          usernameOrEmail: values.emailOrUsername,
          sendEmailInvitation: values.sendInviteEmail,
          isOrg: true,
        });
      }}
    />
  );
}
