import { TRPCError } from '@trpc/server';
import { ContextWithUser } from '../../lib/types';
import { statusCodes } from '../../lib/enums';
import {
  readAppointmentsFromUser,
  readAppointmentsOfCluster,
  readClusterFromUser,
  readClusternameOfCluster,
  readUsersOfCluster,
} from '../services/item.service';
import { ClusterInput } from '../schemata/cluster.schema';

/** TODO Lara
 * Returns the user object from the context.
 *
 * @param ctx
 */

export const getItemOfUserHandler = async ({
  ctx,
}: {
  ctx: ContextWithUser;
}) => {
  try {
    const user = ctx.user;
    const cluster = await readClusterFromUser(user.username);
    const appointments = await readAppointmentsFromUser(user.username);
    return {
      status: statusCodes.SUCCESS,
      data: {
        appointments,
        cluster,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};

/** TODO Lara
 * Returns the user object from the context.
 *
 * @param input
 */
export const getItemOfClusterHandler = async ({
  input,
}: {
  input: ClusterInput;
}) => {
  try {
    const clustercheck = await readClusternameOfCluster(input.clusterId);
    if (clustercheck?.clustername !== input.clustername) {
      console.log('WRONG URL!');
      return { status: statusCodes.FAILURE, data: {} };
    }
    // TODO Lara:
    // throw new WrongURLError({code: 'WRONG_URL_ERROR', message: ''})
    const user = await readUsersOfCluster(input.clusterId);
    const appointments = await readAppointmentsOfCluster(input.clusterId);
    return {
      status: statusCodes.SUCCESS,
      data: {
        user,
        appointments,
      },
    };
    // } catch (err: WrongURLError) {
    //   throw new WrongURLError({code: err.code, message: err.message,})
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};
